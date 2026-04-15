'use server';

import { prisma } from '../lib/prisma';
import { sendReclamacionEmail } from '../lib/email-utils';

export async function createReclamacion(formData: FormData) {
    try {
        const year = new Date().getFullYear();

        // 1. Generar Código Correlativo
        // Buscamos el último reclamo del año para seguir la secuencia RE-YYYY-NNNN
        const lastReclamacion = await prisma.libro_reclamaciones.findFirst({
            where: {
                codigo_seguimiento: {
                    startsWith: `RE-${year}-`
                }
            },
            orderBy: {
                id_reclamo: 'desc'
            }
        });

        let nextNumber = 1;
        if (lastReclamacion) {
            const lastCode = lastReclamacion.codigo_seguimiento;
            const lastPart = lastCode.split('-').pop();
            if (lastPart) {
                nextNumber = parseInt(lastPart) + 1;
            }
        }

        const codigo_seguimiento = `RE-${year}-${nextNumber.toString().padStart(4, '0')}`;

        // 2. Extraer datos del FormData
        const data = {
            codigo_seguimiento,
            nombre_completo: formData.get('nombre_completo') as string,
            tipo_documento: formData.get('tipo_documento') as string,
            numero_documento: formData.get('numero_documento') as string,
            direccion_domicilio: formData.get('direccion_domicilio') as string,
            email: formData.get('email') as string,
            telefono: formData.get('telefono') as string,
            nombre_padre_tutor: formData.get('nombre_padre_tutor') as string || null,
            unidad_negocio: formData.get('unidad_negocio') as string,
            tipo_bien: formData.get('tipo_bien') as string,
            monto_reclamado: formData.get('monto_reclamado') ? parseFloat(formData.get('monto_reclamado') as string) : null,
            descripcion_bien: formData.get('descripcion_bien') as string || null,
            tipo_incidencia: formData.get('tipo_incidencia') as string,
            detalle_incidencia: formData.get('detalle_incidencia') as string,
            pedido_consumidor: formData.get('pedido_consumidor') as string,
            estado: 'Pendiente',
        };

        // 3. Guardar en Base de Datos
        const newReclamacion = await prisma.libro_reclamaciones.create({
            data: data
        });

        // 4. Enviar Correo (Background)
        // No bloqueamos la respuesta principal por si falla el correo, pero lo intentamos.
        // En Next.js Server Actions, podemos esperar o no. Aquí esperaremos para confirmar éxito al usuario.
        const emailResult = await sendReclamacionEmail(newReclamacion);

        if (!emailResult.success) {
            console.warn("La reclamación se guardó pero el correo falló.");
        }

        return {
            success: true,
            codigo: codigo_seguimiento,
            message: "Su reclamación ha sido registrada exitosamente."
        };

    } catch (error) {
        console.error("Error al crear reclamación:", error);
        return {
            success: false,
            error: "Hubo un error al procesar su solicitud. Por favor intente más tarde."
        };
    }
}
