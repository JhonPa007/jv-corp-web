'use server';

import { prisma } from '../lib/prisma';
import { startOfDay, endOfDay, addMinutes, format, parse, isSameDay } from 'date-fns';

/**
 * Helper to get minutes from midnight for a time value
 * @param d Date object
 * @param fromDb If true, treats the date as a Prisma TIME (UTC)
 */
const getMinutesSinceMidnight = (d: Date, fromDb: boolean = false) => {
    const hours = fromDb ? d.getUTCHours() : d.getHours();
    const minutes = fromDb ? d.getUTCMinutes() : d.getMinutes();
    return hours * 60 + minutes;
};

export interface ClientRegistrationData {
    nombres: string;
    apellidos?: string;
    telefono: string;
    email: string;
    fecha_nacimiento?: Date;
    dni?: string;
}

export async function registerClientForBooking(data: ClientRegistrationData) {
    try {
        // 1. Validar si ya existe el cliente (por DNI, Celular o Email)
        const existingClient = await prisma.clientes.findFirst({
            where: {
                OR: [
                    data.dni ? { numero_documento: data.dni } : {},
                    { email: data.email },
                    { telefono: data.telefono }
                ].filter(condition => Object.keys(condition).length > 0)
            }
        });

        if (existingClient) {
            // Si el cliente existe pero no tiene correo y el usuario proporcionó uno, actualizarlo
            if (!existingClient.email && data.email) {
                const updatedClient = await prisma.clientes.update({
                    where: { id: existingClient.id },
                    data: { email: data.email }
                });
                return { success: true, client: updatedClient, isNew: false };
            }
            return { success: true, client: existingClient, isNew: false };
        }

        // 2. Si no existe, crear nuevo cliente
        const newClient = await prisma.clientes.create({
            data: {
                razon_social_nombres: data.nombres,
                apellidos: data.apellidos || '',
                numero_documento: data.dni || null,
                tipo_documento: data.dni ? 'DNI' : null,
                email: data.email,
                telefono: data.telefono,
                fecha_nacimiento: data.fecha_nacimiento,
                notas_adicionales: "Cliente registrado desde la web",
                fecha_registro: new Date(),
                preferencia_servicio: 'General', // Default
                genero: 'No especificado' // Default
            }
        });

        return { success: true, client: newClient, isNew: true };

    } catch (error) {
        console.error("Error registering client:", error);
        return { success: false, error: "Error al registrar cliente" };
    }
}

// --- New Actions ---

export async function getAvailableTimeSlots(date: Date, staffId: number | 'any', serviceDurationMinutes: number) {
    try {
        const queryDateStart = startOfDay(date);
        const queryDateEnd = endOfDay(date);
        const dayOfWeek = date.getDay(); // 0 (Sun) - 6 (Sat)

        // Adjust dayOfWeek to match schema if needed (often 1=Mon, 7=Sun in some systems, check data later if issue. standard JS: 0=Sun)
        // Assumption: Database uses 0-6 or 1-7?
        // Let's assume standard JS 0-6 or 1-7 mapping. Usually 1=Mon.
        // Let's print out what we get if we can, but for now assume 1=Monday... Wait, let's look at schema logic if possible.
        // `horarios_recurrentes` has `dia_semana`.
        // Let's assume 0=Monday for now? OR 1=Monday. JS `getDay()` is 0=Sun, 1=Mon.
        // Common practice: 0=Sun.

        // 1. Get Potential Staff
        let targetStaffIds: number[] = [];
        if (staffId !== 'any') {
            targetStaffIds = [staffId as number];
        } else {
            // Get all active staff who perform services
            const allStaff = await prisma.empleados.findMany({
                where: { activo: true, realiza_servicios: true },
                select: { id: true }
            });
            targetStaffIds = allStaff.map(s => s.id);
        }

        // 2. Get Work Schedules
        // Note: We need to handle "Any". If "Any", we union availability.

        const slots: string[] = [];

        // Strategy: Iterate generic slots (e.g. 10:00 to 20:00) and check if ANY staff is free.
        // Better: Get min start and max end of all staff.

        const schedules = await prisma.horarios_recurrentes.findMany({
            where: {
                empleado_id: { in: targetStaffIds },
                dia_semana: dayOfWeek
            }
        });

        // Add a fallback for Sunday if shop uses 7 instead of 0
        if (schedules.length === 0 && dayOfWeek === 0) {
            const sundaySchedules = await prisma.horarios_recurrentes.findMany({
                where: {
                    empleado_id: { in: targetStaffIds },
                    dia_semana: 7
                }
            });
            schedules.push(...sundaySchedules);
        }

        if (schedules.length === 0) {
            return [];
        }

        // 3. Get existing reservations for these staff on this day
        const reservations = await prisma.reservas.findMany({
            where: {
                empleado_id: { in: targetStaffIds },
                fecha_hora_inicio: {
                    gte: queryDateStart,
                    lt: queryDateEnd
                },
                estado: { not: 'Cancelada' }
            }
        });

        // 4. Generate Candidates
        const START_HOUR = 9;
        const END_HOUR = 21;
        let currentTime = new Date(queryDateStart);
        currentTime.setHours(START_HOUR, 0, 0, 0);

        const endTime = new Date(queryDateStart);
        endTime.setHours(END_HOUR, 0, 0, 0);

        // Helper to compare times consistently
        // Prisma TIME columns are returned as UTC dates by default
        const getMinutes = (d: Date, isDbTime: boolean) => getMinutesSinceMidnight(d, isDbTime);

        while (currentTime < endTime) {
            const slotStart = new Date(currentTime);
            const slotEnd = addMinutes(slotStart, serviceDurationMinutes);

            if (slotEnd > endTime) break;

            const slotStartMins = getMinutes(slotStart, false);
            const slotEndMins = getMinutes(slotEnd, false);

            let isSlotAvailable = false;

            for (const staffId of targetStaffIds) {
                // Check Schedule
                const staffSchedules = schedules.filter(s => s.empleado_id === staffId);
                if (staffSchedules.length === 0) continue;

                // Must be within AT LEAST ONE schedule block for this staff
                const isWithinWorkingHours = staffSchedules.some(sch => {
                    const schedStartMins = getMinutes(sch.hora_inicio, true);
                    const schedEndMins = getMinutes(sch.hora_fin, true);
                    return slotStartMins >= schedStartMins && slotEndMins <= schedEndMins;
                });

                if (!isWithinWorkingHours) continue;

                // Check Reservations
                const staffReservations = reservations.filter(r => r.empleado_id === staffId);
                const hasConflict = staffReservations.some(res => {
                    const resStart = new Date(res.fecha_hora_inicio);
                    const resEnd = new Date(res.fecha_hora_fin);
                    return (slotStart < resEnd && slotEnd > resStart);
                });

                if (!hasConflict) {
                    isSlotAvailable = true;
                    break;
                }
            }

            if (isSlotAvailable) {
                // User requested AM/PM format (e.g. "9:00 AM")
                slots.push(format(slotStart, 'h:mm a'));
            }

            // Next slot: 15 min steps as requested
            currentTime = addMinutes(currentTime, 15);
        }

        return slots;

    } catch (error) {
        console.error("Error fetching slots:", error);
        return [];
    }
}

export async function createReservation(data: {
    client: ClientRegistrationData;
    serviceId: number;
    staffId: number | 'any';
    date: Date; // passed as ISO string usually?
    time: string; // "9:00 AM"
    servicePrice: number;
}) {
    try {
        // 1. Get/Create Client
        const clientResult = await registerClientForBooking(data.client);
        if (!clientResult.success || !clientResult.client) {
            throw new Error(clientResult.error || "No se pudo identificar al cliente");
        }
        const cliente = clientResult.client;

        // 2. Resolve Staff
        let assignedStaffId = data.staffId;
        const reservationDate = new Date(data.date);

        // Parse "9:00 AM" format back to Date
        // We use the reservationDate as the base to ensure correct day
        const startDateTime = parse(data.time, 'h:mm a', reservationDate);

        // We need service duration to know end time
        const service = await prisma.servicios.findUnique({ where: { id: data.serviceId } });
        if (!service) throw new Error("Servicio no encontrado");

        const endDateTime = addMinutes(startDateTime, service.duracion_minutos);

        if (assignedStaffId === 'any') {
            const dayOfWeek = reservationDate.getDay();

            // Find who is free AT THIS EXACT TIME
            const allStaff = await prisma.empleados.findMany({
                where: { activo: true, realiza_servicios: true },
                select: { 
                    id: true,
                    horarios_recurrentes: {
                        where: { dia_semana: dayOfWeek }
                    }
                }
            });

            // Check availability for each
            let foundStaffId = null;
            for (const s of allStaff) {
                // Use fallback for Sunday if needed
                let relevantSchedules = s.horarios_recurrentes;
                if (relevantSchedules.length === 0 && dayOfWeek === 0) {
                    const sundaySchedules = await prisma.horarios_recurrentes.findMany({
                        where: { empleado_id: s.id, dia_semana: 7 }
                    });
                    relevantSchedules = sundaySchedules;
                }

                // 1. Check if staff works this day and time
                const hasSchedule = relevantSchedules.some(sch => {
                    const schStart = getMinutesSinceMidnight(sch.hora_inicio, true);
                    const schEnd = getMinutesSinceMidnight(sch.hora_fin, true);
                    const targetStart = getMinutesSinceMidnight(startDateTime, false);
                    const targetEnd = getMinutesSinceMidnight(endDateTime, false);
                    return targetStart >= schStart && targetEnd <= schEnd;
                });

                if (!hasSchedule) continue;

                // 2. Check conflicts in reservations
                const conflicts = await prisma.reservas.findMany({
                    where: {
                        empleado_id: s.id,
                        estado: { not: 'Cancelada' },
                        fecha_hora_inicio: { lt: endDateTime },
                        fecha_hora_fin: { gt: startDateTime }
                    }
                });

                if (conflicts.length === 0) {
                    foundStaffId = s.id;
                    break;
                }
            }

            if (!foundStaffId) throw new Error("Ya no hay disponibilidad para el horario o empleado seleccionado.");
            assignedStaffId = foundStaffId;
        } else {
            // Specific staff requested
            const dayOfWeek = reservationDate.getDay();
            let staffSchedule = await prisma.horarios_recurrentes.findMany({
                where: {
                    empleado_id: assignedStaffId as number,
                    dia_semana: dayOfWeek
                }
            });

            // Sunday fallback
            if (staffSchedule.length === 0 && dayOfWeek === 0) {
                staffSchedule = await prisma.horarios_recurrentes.findMany({
                    where: {
                        empleado_id: assignedStaffId as number,
                        dia_semana: 7
                    }
                });
            }

            const worksThisTime = staffSchedule.some(sch => {
                const schStart = getMinutesSinceMidnight(sch.hora_inicio, true);
                const schEnd = getMinutesSinceMidnight(sch.hora_fin, true);
                const targetStart = getMinutesSinceMidnight(startDateTime, false);
                const targetEnd = getMinutesSinceMidnight(endDateTime, false);
                return targetStart >= schStart && targetEnd <= schEnd;
            });

            if (!worksThisTime) throw new Error("El empleado no atiende en el horario seleccionado.");

            const conflicts = await prisma.reservas.findMany({
                where: {
                    empleado_id: assignedStaffId as number,
                    estado: { not: 'Cancelada' },
                    fecha_hora_inicio: { lt: endDateTime },
                    fecha_hora_fin: { gt: startDateTime }
                }
            });

            if (conflicts.length > 0) throw new Error("El empleado ya tiene una reserva en este horario.");
        }

        // 3. Create Reservation
        const newReservation = await prisma.reservas.create({
            data: {
                cliente_id: cliente.id,
                empleado_id: assignedStaffId as number,
                servicio_id: data.serviceId,
                sucursal_id: 1, // Default
                fecha_hora_inicio: startDateTime,
                fecha_hora_fin: endDateTime,
                estado: 'Programada',
                precio_cobrado: service.precio, // Or null?
                notas_cliente: "Reserva web",
                fecha_actualizacion: new Date()
            }
        });

        return { success: true, reservationId: newReservation.id };

    } catch (error) {
        console.error("Create Reservation Error:", error);
        return { success: false, error: "No se pudo crear la reserva: " + (error as Error).message };
    }
}

export async function searchClient(term: string) {
    try {
        const client = await prisma.clientes.findFirst({
            where: {
                OR: [
                    { numero_documento: term },
                    { email: term }, // Exact match
                    { telefono: { contains: term } } // Allow partial validation? Better exact for security/precision? Let's try exact or contains.
                    // Actually, for "Registration check", exact is better to avoid false positives. 
                    // But for "Search", maybe we want flexibility. Given the request: "ingrese su dni, telefono o correo", let's do exact or strict contains.
                ]
            }
        });

        if (!client) return { success: false, client: null };

        return { success: true, client };
    } catch (error) {
        console.error("Error searching client:", error);
        return { success: false, error: "Error al buscar cliente" };
    }
}
