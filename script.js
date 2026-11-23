// 1. Trigger Scroll Blur Animation ONLY ONCE
document.addEventListener("DOMContentLoaded", () => {
    const applyBox = document.querySelector(".apply-box");
    if (applyBox) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("revealed");
                    // Stop observing so blur never re-triggers when scrolling up/down
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        observer.observe(applyBox);
    }
});

// 2. Pause Website & Show Bouncy Pop-up Window During Submission
const registrationForm = document.getElementById("candidate-form");
const submissionOverlay = document.getElementById("submission-overlay");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");
const modalLoader = document.getElementById("modal-loader");

// Replace with your deployed Google Apps Script Web App URL
const SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL";

if (registrationForm) {
    registrationForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        if (!registrationForm.checkValidity()) {
            registrationForm.reportValidity();
            return;
        }

        // Reset modal state & pause page interaction
        modalLoader.style.display = "flex";
        modalTitle.textContent = "Your Application is Submitting...";
        modalDesc.textContent = "Please wait while we record your registration details. Do not close or refresh this window.";
        document.body.style.overflow = "hidden";
        submissionOverlay.classList.add("active");

        try {
            const formData = new FormData(registrationForm);

            // Convert uploaded screenshot to Base64 so Google Apps Script can save it cleanly
            const fileInput = document.getElementById("payment-screenshot");
            if (fileInput && fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const base64Data = await toBase64(file);
                formData.append("screenshotBase64", base64Data);
                formData.append("screenshotName", file.name);
            }

            if (SCRIPT_URL === "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL") {
                // Simulated delay if URL isn't pasted yet so you can preview the bouncy loader
                await new Promise(resolve => setTimeout(resolve, 2200));
            } else {
                const response = await fetch(SCRIPT_URL, {
                    method: "POST",
                    body: formData
                });
                if (!response.ok) throw new Error("Network response was not ok");
            }

            // Show completion message inside pop-up before unpausing
            modalLoader.style.display = "none";
            modalTitle.textContent = "Application Submitted!";
            modalDesc.textContent = "Thank you for registering with Rajasheela Foundation.";

            setTimeout(() => {
                submissionOverlay.classList.remove("active");
                document.body.style.overflow = "";
                registrationForm.reset();
            }, 2200);

        } catch (error) {
            submissionOverlay.classList.remove("active");
            document.body.style.overflow = "";
            alert("Submission failed. Please check your internet connection and try again.");
        }
    });
}

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
