document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const responseMsg = document.getElementById('response-msg');

    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        
        // UI Lockdown
        submitBtn.disabled = true;
        submitBtn.textContent = "Processing...";
        if (responseMsg) {
            responseMsg.innerText = "Sending your message...";
            responseMsg.style.color = "#ffa500";
        }

        const rawData = new FormData(contactForm);
        const formData = Object.fromEntries(rawData.entries());

        // Simple Bot Check (if you add the hidden input)
        if (formData._honey) return;

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData),
            });

            // Parse JSON only if the response is actually JSON
            const isJson = response.headers.get('content-type')?.includes('application/json');
            const result = isJson ? await response.json() : null;

            if (response.ok) {
                if (responseMsg) {
                    responseMsg.innerText = "🚀 Message sent successfully!";
                    responseMsg.style.color = "#4CAF50";
                }
                contactForm.reset();
            } else {
                // Check if the server sent a specific error message
                throw new Error(result?.message || `Error: ${response.status}`);
            }
        } catch (error) {
            console.error("Submission error:", error);
            if (responseMsg) {
                responseMsg.innerText = `❌ ${error.message || "Something went wrong. Please try again."}`;
                responseMsg.style.color = "#f44336";
            }
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
});