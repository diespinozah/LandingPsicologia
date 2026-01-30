const { Resend } = require('resend');

exports.handler = async (event, context) => {
  // Solo permitir POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método no permitido' }),
    };
  }

  // Headers CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Manejar preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Parsear datos del formulario (B2B fields)
    const data = JSON.parse(event.body);
    const { nombre, organizacion, cargo, email, telefono, tipoServicio, mensaje } = data;

    // Validar campos requeridos
    if (!nombre || !organizacion || !cargo || !email || !mensaje) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Faltan campos requeridos' }),
      };
    }

    // Inicializar Resend con API key desde variables de entorno
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Mapear tipos de servicio a nombres legibles
    const serviciosMap = {
      consultoria: 'Consultoría organizacional',
      capacitacion: 'Capacitación o taller',
      charla: 'Charla o seminario',
      coaching: 'Coaching ejecutivo',
      diagnostico: 'Diagnóstico de clima',
      otro: 'Otro',
    };

    const servicioNombre = serviciosMap[tipoServicio] || 'No especificado';

    // Enviar email
    const { data: emailData, error } = await resend.emails.send({
      from: 'Axia Consultora <onboarding@resend.dev>', // Cambiar cuando tengas dominio verificado
      to: [process.env.EMAIL_DESTINO || 'contacto@axia.cl'],
      replyTo: email,
      subject: `Nuevo contacto B2B - ${organizacion} | ${nombre}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #F7F9FC;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1E3A5F 0%, #2E5077 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Axia</h1>
            <p style="color: #5BA88F; margin: 8px 0 0 0; font-size: 14px;">Consultoría en Desarrollo Organizacional</p>
          </div>

          <!-- Alert Banner -->
          <div style="background-color: #E8B059; padding: 12px 20px; text-align: center;">
            <p style="color: #1A2B3C; margin: 0; font-weight: 600; font-size: 14px;">
              📩 Nuevo contacto desde el formulario web
            </p>
          </div>

          <!-- Content -->
          <div style="padding: 30px; background-color: white;">
            <!-- Contact Info Section -->
            <h2 style="color: #1E3A5F; border-bottom: 3px solid #3D8B7A; padding-bottom: 10px; margin-top: 0; font-size: 18px;">
              Información del Contacto
            </h2>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
              <tr>
                <td style="padding: 12px 0; color: #64748B; width: 150px; vertical-align: top; font-size: 14px;">
                  <strong>Nombre:</strong>
                </td>
                <td style="padding: 12px 0; color: #1A2B3C; font-size: 14px;">
                  ${nombre}
                </td>
              </tr>
              <tr style="background-color: #F7F9FC;">
                <td style="padding: 12px; color: #64748B; vertical-align: top; font-size: 14px;">
                  <strong>Organización:</strong>
                </td>
                <td style="padding: 12px; color: #1A2B3C; font-size: 14px; font-weight: 600;">
                  ${organizacion}
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #64748B; vertical-align: top; font-size: 14px;">
                  <strong>Cargo:</strong>
                </td>
                <td style="padding: 12px 0; color: #1A2B3C; font-size: 14px;">
                  ${cargo}
                </td>
              </tr>
              <tr style="background-color: #F7F9FC;">
                <td style="padding: 12px; color: #64748B; vertical-align: top; font-size: 14px;">
                  <strong>Email:</strong>
                </td>
                <td style="padding: 12px; color: #1A2B3C; font-size: 14px;">
                  <a href="mailto:${email}" style="color: #1E3A5F; text-decoration: none;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #64748B; vertical-align: top; font-size: 14px;">
                  <strong>Teléfono:</strong>
                </td>
                <td style="padding: 12px 0; color: #1A2B3C; font-size: 14px;">
                  ${telefono || 'No proporcionado'}
                </td>
              </tr>
              <tr style="background-color: #F7F9FC;">
                <td style="padding: 12px; color: #64748B; vertical-align: top; font-size: 14px;">
                  <strong>Servicio de interés:</strong>
                </td>
                <td style="padding: 12px; color: #1A2B3C; font-size: 14px;">
                  <span style="background-color: #3D8B7A; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px;">
                    ${servicioNombre}
                  </span>
                </td>
              </tr>
            </table>

            <!-- Message Section -->
            <h3 style="color: #1E3A5F; border-bottom: 3px solid #3D8B7A; padding-bottom: 10px; font-size: 16px;">
              Mensaje
            </h3>
            <div style="background-color: #F7F9FC; padding: 20px; border-radius: 8px; border-left: 4px solid #1E3A5F;">
              <p style="color: #1A2B3C; line-height: 1.7; margin: 0; white-space: pre-wrap; font-size: 14px;">${mensaje}</p>
            </div>

            <!-- Action Button -->
            <div style="text-align: center; margin-top: 30px;">
              <a href="mailto:${email}?subject=Re: Consulta desde Axia - ${organizacion}"
                 style="display: inline-block; background-color: #1E3A5F; color: white; padding: 14px 28px; text-decoration: none; border-radius: 25px; font-weight: 600; font-size: 14px;">
                Responder a ${nombre}
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #1A2B3C; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
            <p style="color: #64748B; margin: 0; font-size: 12px;">
              Este mensaje fue enviado desde el formulario de contacto de
            </p>
            <p style="color: #3D8B7A; margin: 5px 0 0 0; font-size: 12px; font-weight: 600;">
              axia.cl
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Error de Resend:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Error al enviar el email' }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Email enviado correctamente',
        id: emailData.id
      }),
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Error interno del servidor' }),
    };
  }
};
