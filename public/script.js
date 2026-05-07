document.addEventListener('DOMContentLoaded', () => {
    // --- MOBILE MENU LOGIC ---
    const menuToggle = document.querySelector('.menu-toggle'); // unify selector
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isActive = navLinks.classList.toggle('active');
            menuToggle.classList.toggle('is-active');
            menuToggle.setAttribute('aria-expanded', isActive);
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('is-active');
                menuToggle.setAttribute('aria-expanded', false);
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
                responseMsg.style.color = "#ffa500";
            }

            const rawData = new FormData(contactForm);
            const formData = Object.fromEntries(rawData.entries());

            // Honeypot Bot Check
            if (formData._honey) {
                console.warn("Spam detected");
                // Reset UI so user isn’t stuck
