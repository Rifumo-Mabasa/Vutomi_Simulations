import { Resend } from 'resend';

// Initialize Resend with your API Key (stored in Vercel Environment Variables)
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { name, email, message } = req.body;

    try {
        await resend.emails.send({
            from: 'Website Form <onboarding@resend.dev>', // See note below about domains
            to: 'rifumo.mabasa99@gmail.com',
            reply_to: email, // This allows Vutomi to click 'Reply' to email the user back
            subject: `New Inquiry from ${name}`,
            html: `
                <div style="font-family: sans-serif; line-height: 1.5;">
                    <h2>New Message from Website</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Message:</strong></p>
                    <blockquote style="border-left: 4px solid #ccc; padding-left: 15px; margin-left: 0;">
                        ${message}
                    </blockquote>
                </div>
            `,
        });

        return res.status(200).json({ message: 'Success' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to send email' });
    }
}