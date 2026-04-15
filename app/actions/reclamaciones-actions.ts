'use server';

import { prisma } from '../lib/prisma';
import { sendReclamacionEmail } from '../lib/email-utils';
import { headers } from 'next/headers';

export async function createReclamacion(formData: FormData) {
    try {
        const headersList = await headers();
        const ip = headersList.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

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
            acepto_terminos: formData.get('acepto_terminos') === 'on',
            ip_registro: ip,
            fecha_consentimiento: new Date(),
        };

        // 3. Guardar en Base de Datos
        const newReclamacion = await prisma.libro_reclamaciones.create({
            data: data
        });

        // 4. Enviar Correo (No bloqueante)
        // Ejecutamos el envío sin 'await' para que la respuesta al usuario sea inmediata.
        // Capturamos el error internamente para no romper la ejecución.
        sendReclamacionEmail(newReclamacion).then(res => {
            if (!res.success) console.error("Error enviando correo de reclamación:", res.error);
        }).catch(err => {
            console.error("Error fatal en proceso de correo:", err);
        });

        return {
            success: true,
            codigo: codigo_seguimiento,
            message: "Su reclamación ha sido registrada exitosamente."
        };

    } catch (error: any) {
        console.error("Error crítico en Libro de Reclamaciones:", error);
        return {
            success: false,
            message: error?.message || "Hubo un error al procesar su solicitud. Por favor intente más tarde."
        };
    }
}
