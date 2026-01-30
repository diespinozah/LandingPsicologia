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
    // Parsear datos del formulario
    const data = JSON.parse(event.body);
    const { nombre, email, telefono, servicio, mensaje } = data;

    // Validar campos requeridos
    if (!nombre || !email || !mensaje) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Faltan campos requeridos' }),
      };
    }

    // Inicializar Resend con API key desde variables de entorno
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Mapear servicios a nombres legibles
    const serviciosMap = {
      individual: 'Terapia Individual',
      pareja: 'Terapia de Pareja',
      familiar: 'Terapia Familiar',
      evaluacion: 'Evaluación Psicológica',
      otro: 'Otro',
    };

    const servicioNombre = serviciosMap[servicio] || 'No especificado';

    // Enviar email
    const { data: emailData, error } = await resend.emails.send({
      from: 'MenteSerena <onboarding@resend.dev>', // Cambiar cuando tengas dominio verificado
      to: [process.env.EMAIL_DESTINO || 'tu-email@ejemplo.com'],
      replyTo: email,
      subject: `Nuevo mensaje de contacto - ${nombre}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #2D6A4F; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">MenteSerena</h1>
            <p style="color: #74C69D; margin: 5px 0 0 0;">Nuevo mensaje de contacto</p>
          </div>

          <div style="padding: 30px; background-color: #F8FAF9;">
            <h2 style="color: #1B4332; border-bottom: 2px solid #74C69D; padding-bottom: 10px;">
              Datos del contacto
            </h2>

            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #666; width: 140px;"><strong>Nombre:</strong></td>
                <td style="padding: 10px 0; color: #1B4332;">${nombre}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666;"><strong>Email:</strong></td>
                <td style="padding: 10px 0; color: #1B4332;">
                  <a href="mailto:${email}" style="color: #2D6A4F;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666;"><strong>Teléfono:</strong></td>
                <td style="padding: 10px 0; color: #1B4332;">${telefono || 'No proporcionado'}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666;"><strong>Servicio:</strong></td>
                <td style="padding: 10px 0; color: #1B4332;">${servicioNombre}</td>
              </tr>
            </table>

            <h3 style="color: #1B4332; margin-top: 25px; border-bottom: 2px solid #74C69D; padding-bottom: 10px;">
              Mensaje
            </h3>
            <div style="background-color: white; padding: 20px; border-radius: 10px; border-left: 4px solid #2D6A4F;">
              <p style="color: #333; line-height: 1.6; margin: 0; white-space: pre-wrap;">${mensaje}</p>
            </div>
          </div>

          <div style="background-color: #1B4332; padding: 15px; text-align: center;">
            <p style="color: #74C69D; margin: 0; font-size: 12px;">
              Este mensaje fue enviado desde el formulario de contacto de MenteSerena
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
