document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const responseMsg = document.getElementById('response-msg');
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Visual Feedback: Disable button and show loading state
        submitBtn.disabled = true;
        submitBtn.innerText = 'Sending...';
        responseMsg.style.color = '#ffffff';
        responseMsg.innerText = 'Processing your inquiry...';

        // 2. Gather Data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        try {
            // 3. Send to Vercel API
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                // Success state
                responseMsg.style.color = '#4BB543'; // Success Green
                responseMsg.innerText = 'Message sent successfully! We will get back to you soon.';
                contactForm.reset();
            } else {
                // Server-side error
                throw new Error(result.message || 'Something went wrong.');
            }

        } catch (error) {
            // Network or logic error
            responseMsg.style.color = '#ff4d4d'; // Error Red
            responseMsg.innerText = `Error: ${error.message}`;
        } finally {
            // 4. Reset button state
            submitBtn.disabled = false;
            submitBtn.innerText = 'Send Message';
        }
    });
});