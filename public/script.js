document.addEventListener('DOMContentLoaded', () => {
    // --- MOBILE MENU LOGIC ---
    const menu = document.querySelector('#mobile-menu');
    const menuLinks = document.querySelector('.nav-links');

    // Only add listener if elements exist to avoid console errors
    if (menu && menuLinks) {
        menu.addEventListener('click', () => {
            menuLinks.classList.toggle('active');
            menu.classList.toggle('is-active');
        });

        // Close menu when a link is clicked (improves mobile UX)
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                menuLinks.classList.remove('active');
                menu.classList.remove('is-active');
            });
        });
    }

    // --- CONTACT FORM LOGIC ---
    const contactForm = document.getElementById('contact-form');
    const responseMsg = document.getElementById('response-msg');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            
            // UI Feedback
            submitBtn.disabled = true;
            submitBtn.textContent = "Processing...";
            if (responseMsg) {
                responseMsg.innerText = "Sending your message...";
                responseMsg.style.color = "#ffa500"; // Orange
            }

            const rawData = new FormData(contactForm);
            const formData = Object.fromEntries(rawData.entries());

            // Honeypot Bot Check
            if (formData._honey) {
                console.warn("Spam detected");
                return;
            }

            try {
                // Ensure the path matches your api folder structure (lowercase)
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(formData),
                });

                const isJson = response.headers.get('content-type')?.includes('application/json');
                const result = isJson ? await response.json() : null;

                if (response.ok) {
                    if (responseMsg) {
                        responseMsg.innerText = "🚀 Message sent successfully!";
                        responseMsg.style.color = "#4CAF50"; // Green
                    }
                    contactForm.reset();
                } else {
                    // This handles the 405 error if it comes from the server
                    throw new Error(result?.message || `Status ${response.status}: Method not allowed or path incorrect.`);
                }
            } catch (error) {
                console.error("Submission error:", error);
                if (responseMsg) {
                    responseMsg.innerText = `❌ ${error.message}`;
                    responseMsg.style.color = "#f44336"; // Red
                }
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }
});
// Example: Assuming you add a <div class="menu-toggle"></div> to your HTML
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});