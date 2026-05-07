import { Resend } from 'resend';

// Initialize Resend with your API Key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, message } = req.body;

    // Basic server-side validation
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Send the email
    const data = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>', // See note below about domains
      to: ['vutomi@mabparkholdings.com'], // Where you want to receive the messages
      subject: `New Inquiry from ${name}`,
      reply_to: email, // So you can hit 'reply' in your inbox
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return res.status(200).json({ message: 'Email sent successfully', id: data.id });
  } catch (error) {
    console.error("Resend Error:", error);
    return res.status(500).json({ message: 'Failed to send email' });
  }
}
