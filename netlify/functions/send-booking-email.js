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

    const { data, error } = await resend.emails.send({
      from: 'Perficient Logistics <info@perficientlogisticsltd.com>', // Verified sender you already use
      to: ['iperficientlogisticsltd@gmail.com', 'obinnanweke15@gmail.com'], // Your inbox
      subject: `New Booking – ${serviceType || 'Ride'} from ${fullName || phoneNumber || 'Unknown customer'}`,
      html: `
        <h2>New Booking Submission</h2>
        <p><strong>Service Type:</strong> ${serviceType || 'N/A'}</p>
        <p><strong>Full Name:</strong> ${fullName || 'N/A'}</p>
        <p><strong>Phone Number:</strong> ${phoneNumber || 'N/A'}</p>
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
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Failed to send email', details: error }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully', data }),
    };
  } catch (error) {
    console.error('send-booking-email function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error' }),
    };
  }
};
