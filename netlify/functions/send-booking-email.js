import { Resend } from 'resend';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Email service is not configured' }),
    };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const body = JSON.parse(event.body || '{}');

    const {
      serviceType,
      pickupLocation,
      dropoffLocation,
      pickupDate,
      pickupTime,
      dropoffDate,
      dropoffTime,
      passengers,
      rideType,
      fullName,
      phoneNumber,
      email,
      specialRequest,
      botField,
    } = body;

    // Optional honeypot like your other project
    if (botField) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Bot detected' }),
      };
    }

    const bookingDetails = `
      <h3 style="color: #333;">Booking Details</h3>
      <p><strong>Service Type:</strong> ${serviceType || 'N/A'}</p>
      <p><strong>Passengers:</strong> ${passengers || 'N/A'}</p>
      <p><strong>Ride Type:</strong> ${rideType || 'N/A'}</p>
      <hr />
      <p><strong>Pickup Location:</strong> ${pickupLocation || 'N/A'}</p>
      <p><strong>Pickup Date:</strong> ${pickupDate || 'N/A'}</p>
      <p><strong>Pickup Time:</strong> ${pickupTime || 'N/A'}</p>
      <p><strong>Dropoff Location:</strong> ${dropoffLocation || 'N/A'}</p>
      <p><strong>Dropoff Date:</strong> ${dropoffDate || 'N/A'}</p>
      <p><strong>Dropoff Time:</strong> ${dropoffTime || 'N/A'}</p>
      <hr />
      <p><strong>Special Request:</strong></p>
      <p>${specialRequest ? specialRequest.replace(/\n/g, '<br />') : 'None'}</p>
    `;

    // Send admin notification email
    const { data: adminData, error: adminError } = await resend.emails.send({
      from: 'Perficient Logistics <info@perficientlogisticsltd.com>',
      to: ['perficientlogisticsltd@gmail.com', 'obinna.nweke@beamxsolutions.com'],
      subject: `New Booking – ${serviceType || 'Ride'} from ${fullName || phoneNumber || 'Unknown customer'}`,
      html: `
        <h2>New Booking Submission</h2>
        <p><strong>Full Name:</strong> ${fullName || 'N/A'}</p>
        <p><strong>Phone Number:</strong> ${phoneNumber || 'N/A'}</p>
        <p><strong>Email:</strong> ${email || 'N/A'}</p>
        <hr />
        ${bookingDetails}
      `,
    });

    if (adminError) {
      console.error('Resend admin email error:', adminError);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Failed to send admin email', details: adminError }),
      };
    }

    // Send confirmation email to client (only if email is provided)
    let clientData = null;
    let clientError = null;

    if (email) {
      const result = await resend.emails.send({
        from: 'Perficient Logistics <info@perficientlogisticsltd.com>',
        to: email,
        subject: 'Booking Confirmation – Perficient Logistics',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="https://bookings.perficientlogisticsltd.com/logo--2--2.png" alt="Perficient Logistics" style="max-width: 200px; height: auto;" />
            </div>

            <h2 style="color: #1e40af; margin-bottom: 20px;">Booking Confirmation</h2>

            <p>Hi ${fullName || 'Valued Customer'},</p>

            <p>Thank you for booking with Perficient Logistics! We've received your booking request and will be in touch shortly to confirm all details.</p>

            <h3 style="color: #333; margin-top: 30px;">Your Booking Details</h3>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Full Name:</strong> ${fullName || 'N/A'}</p>
              <p><strong>Phone Number:</strong> ${phoneNumber || 'N/A'}</p>
              ${bookingDetails}
            </div>

            <p style="margin-top: 30px; color: #666;">If you have any questions or need to make changes to your booking, please don't hesitate to contact us.</p>

            <p style="margin-top: 20px;">Best regards,<br/>
            <strong>Perficient Logistics Team</strong></p>

            <hr style="margin-top: 40px; border: none; border-top: 1px solid #e5e7eb;" />
          </div>
        `,
      });

      clientData = result.data;
      clientError = result.error;

      if (clientError) {
        console.error('Resend client email error:', clientError);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Emails sent successfully',
        adminEmail: adminData,
        clientEmail: clientData,
      }),
    };
  } catch (error) {
    console.error('send-booking-email function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error' }),
    };
  }
};