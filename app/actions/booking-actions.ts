'use server';

import { prisma } from '../lib/prisma';

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
