
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

if(mobileMenu && navLinks) {
    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Active link highlighter
const currentLocation = location.href;
const menuItem = document.querySelectorAll('.nav-links a');
menuItem.forEach(item => {
    if(item.href === currentLocation) {
        item.classList.add('active');
    }
});

// ==========================================================
// 1. HERO SECTION BACKGROUND SMOOTH SLIDESHOW
// ==========================================================
const heroSlides = document.querySelectorAll('.hero-slide');
if(heroSlides.length > 0) {
    let currentSlide = 0;

    function nextHeroSlide() {
        heroSlides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % heroSlides.length;
        heroSlides[currentSlide].classList.add('active');
    }

    // Change slide every 6 seconds with buttery-smooth crossfade
    setInterval(nextHeroSlide, 6000);
}
// ==========================================================
// 2. COUNTDOWN TIMER LOGIC (Term Opening / Milestone)
// ==========================================================
function updateCountdown() {
    const targetDate = new Date('February 1, 2027 08:00:00').getTime();
    const now = new Date().getTime();
    const difference = targetDate - now;

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (daysEl && hoursEl && minutesEl && secondsEl) {
        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            daysEl.textContent = String(days).padStart(2, '0');
            hoursEl.textContent = String(hours).padStart(2, '0');
            minutesEl.textContent = String(minutes).padStart(2, '0');
            secondsEl.textContent = String(seconds).padStart(2, '0');
        } else {
            daysEl.textContent = "00";
            hoursEl.textContent = "00";
            minutesEl.textContent = "00";
            secondsEl.textContent = "00";
        }
    }
}
setInterval(updateCountdown, 1000);
updateCountdown();

// ==========================================================
// 3. AUTOMATED TESTIMONIAL SLIDER ROTATION
// ==========================================================
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-item');

function rotateTestimonials() {
    if(testimonials.length > 0) {
        testimonials[currentTestimonial].classList.remove('active');
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        testimonials[currentTestimonial].classList.add('active');
    }
}
if(testimonials.length > 0) {
    setInterval(rotateTestimonials, 5000); // Rotates testimonials every 5 seconds
}

// ==========================================================
// GALLERY LIGHTBOX & FILTER INTERACTIVITY
// ==========================================================
const galleryItems = document.querySelectorAll('.gallery-item');
const lightboxModal = document.getElementById('lightboxModal');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.querySelector('.lightbox-close');

if(lightboxModal) {
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const title = item.querySelector('h4').textContent;
            lightboxModal.style.display = 'block';
            lightboxImg.src = img.src;
            lightboxCaption.textContent = title;
        });
    });

    if(lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            lightboxModal.style.display = 'none';
        });
    }

    lightboxModal.addEventListener('click', (e) => {
        if(e.target === lightboxModal) {
            lightboxModal.style.display = 'none';
        }
    });
}


// // ==========================================================
// // ADMISSIONS ONLINE FORM SUBMISSION HANDLER (AJAX)
// // ==========================================================
// const admissionsForm = document.getElementById('admissionsForm');
// if(admissionsForm) {
//     admissionsForm.addEventListener('submit', function(e) {
//         e.preventDefault();
//         const formData = new FormData(admissionsForm);
        
//         fetch(admissionsForm.action, {
//             method: 'POST',
//             body: formData,
//             headers: {
//                 'Accept': 'application/json'
//             }
//         }).then(response => {
//             if (response.ok) {
//                 admissionsForm.style.display = 'none';
//                 const successBox = document.getElementById('admissionSuccess');
//                 if(successBox) {
//                     successBox.style.display = 'block';
//                 }
//             } else {
//                 alert('There was a problem submitting your application. Please check your network or try again.');
//             }
//         }).catch(error => {
//             alert('Network error. Please check your internet connection.');
//         });
//     });
// }
// ==========================================================
// CONTACT PAGE INQUIRY FORM HANDLER (AJAX)
// ==========================================================

const inquiryForm = document.getElementById("inquiryForm");
const formSuccess = document.getElementById("formSuccess");

if (inquiryForm && formSuccess) {

    const inquiryFields = {

        full_name: document.getElementById("fullName"),
        phone: document.getElementById("phoneNumber"),
        inquiry_type: document.getElementById("inquiryType"),
        message: document.getElementById("message")

    };


    // Clear previous validation messages when fields change

    Object.values(inquiryFields).forEach(field => {

        field.addEventListener("input", () => {
            field.setCustomValidity("");
        });

        field.addEventListener("change", () => {
            field.setCustomValidity("");
        });

    });


    inquiryForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const formData = new FormData(inquiryForm);

        const inquiryData = Object.fromEntries(formData.entries());

        try {

            const serverResponse = await fetch("/api/inquiries", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(inquiryData)

            });

            const result = await serverResponse.json();


            // VALIDATION FAILURE

            if (!serverResponse.ok) {

                let firstInvalidField = null;

                result.errors?.forEach(issue => {

                    const field = issue.path[0];

                    const input = inquiryFields[field];

                    if (input) {

                        input.setCustomValidity(issue.message);

                        if (!firstInvalidField) {
                            firstInvalidField = input;
                        }

                    }

                });

                if (firstInvalidField) {
                    firstInvalidField.reportValidity();
                }

                return;
            }


            // SUCCESSFUL SUBMISSION

            inquiryForm.reset();

            inquiryForm.classList.add("hidden");

            formSuccess.classList.remove("hidden");


        } catch (error) {

            alert("Unable to submit your inquiry. Please try again.");

        }

    });

}





// if(inquiryForm) {
//     inquiryForm.addEventListener('submit', function(e) {
//         e.preventDefault();
//         const formData = new FormData(inquiryForm);
        
//         fetch(inquiryForm.action, {
//             method: 'POST',
//             body: formData,
//             headers: {
//                 'Accept': 'application/json'
//             }
//         }).then(response => {
//             if (response.ok) {
//                 inquiryForm.style.display = 'none';
//                 const formSuccess = document.getElementById('formSuccess');
//                 if(formSuccess) {
//                     formSuccess.style.display = 'block';
//                 }
//             } else {
//                 alert('There was a problem submitting your inquiry. Please check your network  or try again.');
//             }
//         }).catch(error => {
//             alert('Network error. Please check your internet connection.');
//         });
//     });
// }