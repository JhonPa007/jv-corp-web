import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_PORT === '465',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendReclamacionEmail(data: any) {
    const {
        codigo_seguimiento,
        nombre_completo,
        email,
        tipo_incidencia,
        detalle_incidencia,
        pedido_consumidor,
        fecha_registro
    } = data;

    const fechaFormateada = new Date(fecha_registro).toLocaleString('es-PE', {
        timeZone: 'America/Lima'
    });

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px;">
            <div style="text-align: center; border-bottom: 2px solid #ffc107; padding-bottom: 10px; margin-bottom: 20px;">
                <h1 style="color: #333; margin: 0;">Libro de Reclamaciones Virtual</h1>
                <p style="color: #666; font-size: 14px;">JV Corp SAC - RUC 20614287561</p>
            </div>

            <p>Estimado(a) <strong>${nombre_completo}</strong>,</p>
            <p>Hemos recibido su <strong>${tipo_incidencia}</strong> correctamente. A continuación, se detallan los datos registrados:</p>

            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Número de Seguimiento:</strong> <span style="color: #d9534f; font-weight: bold;">${codigo_seguimiento}</span></p>
                <p><strong>Fecha de Registro:</strong> ${fechaFormateada}</p>
                <p><strong>Tipo de Incidencia:</strong> ${tipo_incidencia}</p>
            </div>

            <h3>Detalle de su solicitud:</h3>
            <p style="background-color: #fff; border: 1px solid #eee; padding: 10px;">${detalle_incidencia}</p>

            <h3>Pedido del Consumidor:</h3>
            <p style="background-color: #fff; border: 1px solid #eee; padding: 10px;">${pedido_consumidor}</p>

            <div style="margin-top: 30px; font-size: 13px; color: #777; border-top: 1px solid #eee; pt: 10px;">
                <p>Conforme al Código de Protección y Defensa del Consumidor, le daremos respuesta en un plazo máximo de 15 días hábiles.</p>
                <p>Este es un correo automático, por favor no responda directamente a este mensaje.</p>
            </div>
        </div>
    `;

    try {
        await transporter.sendMail({
            from: `"JV Studio - Libro de Reclamaciones" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `Copia de su ${tipo_incidencia} - ${codigo_seguimiento}`,
            html: htmlContent,
        });

        // También enviar copia a la empresa
        await transporter.sendMail({
            from: `"Sistema Web" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_ADMIN || process.env.EMAIL_USER,
            subject: `NUEVO ${tipo_incidencia.toUpperCase()} - ${codigo_seguimiento} - ${nombre_completo}`,
            html: htmlContent,
        });

        return { success: true };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
    }
}
