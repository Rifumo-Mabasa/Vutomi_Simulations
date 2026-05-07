import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Please fill in all fields.' });
    }

    // 1. Create a transporter (The "Mailman")
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            // Use Environment Variables on Vercel!
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS,  // This is an "App Password," not your regular login
        },
    });

    try {
        // 2. Define the email content
        const mailOptions = {
            from: email, 
            to: 'Vutomi@mabparkholdings.com', // Where you want to receive the leads
            subject: `New Inquiry: ${name} via Vutomi Simulations`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
                    <h2 style="color: #d1643d;">New Website Inquiry</h2>
                    <p><strong>From:</strong> ${name} (${email})</p>
                    <p><strong>Message:</strong></p>
                    <p style="background: #f9f9f9; padding: 15px; border-radius: 5px;">${message}</p>
                </div>
            `,
        };

        // 3. Send it
        await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: 'Success! Your message has been sent.' });

    } catch (error) {
        console.error('Email Error:', error);
        return res.status(500).json({ message: 'Failed to send email. Please try WhatsApp instead.' });
    }
}
