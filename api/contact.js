import { Resend } from 'resend';
import validator from 'validator';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Escape HTML to prevent injection
    const safeName = validator.escape(name);
    const safeEmail = validator.escape(email);
    const safeMessage = validator.escape(message);

    const data = await resend.emails.send({
      from: 'Contact Form <noreply@yourdomain.com>', // use verified domain
      to: ['vutomi@mabparkholdings.com'],
      subject: `New Inquiry from ${safeName}`,
      reply_to: safeEmail,
      html: `
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
      `,
    });

    return res.status(200).json({ message: 'Email sent successfully', id: data.id });
  } catch (error) {
    console.error("Resend Error:", error);
    return res.status(500).json({ message: 'Failed to send email' });
  }
}
