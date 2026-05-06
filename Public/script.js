/**
 * CONTACT FORM HANDLING
 */
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const responseMsg = document.getElementById('response-msg');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // 1. UI Feedback: Identify elements and disable button
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            
            submitBtn.disabled = true;
            submitBtn.textContent = "Processing...";

            if (responseMsg) {
                responseMsg.innerText = "Sending your message...";
                responseMsg.style.color = "#ffa500"; // Orange
            }

            // 2. Data Collection
            // Using FormData is cleaner than grabbing each ID individually
            const rawData = new FormData(contactForm);
            const formData = Object.fromEntries(rawData.entries());

            try {
                // 3. API Call to Vercel Serverless Function
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(formData),
                });

                const result = await response.json();

                if (response.ok) {
                    // Success State
                    if (responseMsg) {
                        responseMsg.innerText = "🚀 Message sent successfully!";
                        responseMsg.style.color = "#4CAF50"; // Green
                    }
                    contactForm.reset();
                } else {
                    // Server-side Error (e.g., validation failed)
                    throw new Error(result.message || "Server error occurred");
                }
            } catch (error) {
                // Network or Logic Error
                console.error("Submission error:", error);
                if (responseMsg) {
                    responseMsg.innerText = "❌ Oops! Something went wrong. Please try again.";
                    responseMsg.style.color = "#f44336"; // Red
                }
            } finally {
                // 4. Reset Button State
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }
});