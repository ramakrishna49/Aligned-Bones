/* ==========================================================================
   ALIGNED BONES - MASTER JAVASCRIPT
   ========================================================================== */

/* ---------- Navbar Scroll Effect ---------- */
const navbar = document.getElementById("navbar");

function updateNavbar() {
    if (navbar) {
        navbar.classList.toggle("scrolled", window.scrollY > 50);
    }
}

window.addEventListener("scroll", updateNavbar);
window.addEventListener("load", updateNavbar);

/* ---------- Mobile Menu Toggle ---------- */
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

/* Keep the current page highlighted while the user scrolls. */
if (navLinks) {
    const currentPath = window.location.pathname.replace(/\/$/, "/index.html");
    const pageLinks = [...navLinks.querySelectorAll("a[href]")].filter((link) =>
        !link.closest(".mobile-booking-item")
    );

    pageLinks.forEach((link) => {
        link.classList.remove("active");
        link.removeAttribute("aria-current");
    });

    const matchingLinks = pageLinks.filter((link) => {
        const url = new URL(link.getAttribute("href"), window.location.href);
        return url.origin === window.location.origin && url.pathname === currentPath;
    });

    matchingLinks.forEach((link) => {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
        const parentDropdownLink = link.closest(".dropdown")?.querySelector(":scope > .dropdown-link");
        if (parentDropdownLink) {
            parentDropdownLink.classList.add("active");
            parentDropdownLink.setAttribute("aria-current", "page");
        }
    });
}

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("active");

        menuToggle.innerHTML = isOpen
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-bars"></i>';
    });
}

/* ---------- Mobile Dropdown Menus ---------- */
document.querySelectorAll(".dropdown-link").forEach((link) => {
    link.addEventListener("click", function (e) {
        if (window.innerWidth <= 1100) {
            const dropdown = this.parentElement;

            // First tap opens the category list; a second tap follows the overview link.
            if (dropdown.classList.contains("open")) return;
            e.preventDefault();

            document.querySelectorAll(".dropdown").forEach((item) => {
                if (item !== dropdown) {
                    item.classList.remove("open");
                }
            });

            dropdown.classList.add("open");
        }
    });
});

/* ---------- Close Mobile Menu on Link Click ---------- */
function closeMobileMenu() {
    if (navLinks) {
        navLinks.classList.remove("active");
    }
    if (menuToggle) {
        menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }
    document.querySelectorAll(".dropdown").forEach((item) => {
        item.classList.remove("open");
    });
}

document.querySelectorAll(".nav-links > li:not(.dropdown) > a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
});

document.querySelectorAll(".nav-actions a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
});

/* Close the open mobile menu when the user taps anywhere outside it. */
document.addEventListener("pointerdown", (event) => {
    if (!navLinks || window.innerWidth > 1100 || !navLinks.classList.contains("active")) {
        return;
    }

    if (navLinks.contains(event.target) || (menuToggle && menuToggle.contains(event.target))) {
        return;
    }

    closeMobileMenu();
});

/* ---------- FAQ Accordion ---------- */
document.querySelectorAll(".faq-question").forEach((button) => {
    button.addEventListener("click", () => {
        const currentItem = button.parentElement;
        const isOpen = currentItem.classList.contains("active");

        document.querySelectorAll(".faq-item").forEach((item) => {
            item.classList.remove("active");
            const q = item.querySelector(".faq-question");
            if (q) {
                q.setAttribute("aria-expanded", "false");
            }
        });

        if (!isOpen) {
            currentItem.classList.add("active");
            button.setAttribute("aria-expanded", "true");
        }
    });
});

/* ---------- Close Menu on Resize ---------- */
window.addEventListener("resize", () => {
    if (window.innerWidth > 1100) {
        closeMobileMenu();
    }
});

/* ---------- Scroll Reveal ---------- */
const revealElements = document.querySelectorAll(".reveal");

// Add staggered delays so entries animate in one-by-one
revealElements.forEach((el, index) => {
    el.classList.add(`stagger-${((index % 5) + 1)}`);
});

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealElements.forEach((element) => element.classList.add("visible"));
} else if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    revealElements.forEach((element) => observer.observe(element));
} else {
    revealElements.forEach((element) => element.classList.add("visible"));
}
/* ---------- Blog Search & Filter (blog.html only) ---------- */
const searchInput = document.getElementById("blogSearch");
const categoryButtons = document.querySelectorAll(".category-btn");
const blogCards = document.querySelectorAll(".blog-card");
const noResults = document.getElementById("noResults");
const resultsCount = document.getElementById("resultsCount");

if (searchInput && categoryButtons && blogCards.length > 0) {
    let selectedCategory = "all";

    function filterBlogs() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        let visibleCount = 0;

        blogCards.forEach((card) => {
            const category = card.dataset.category;
            const content = card.innerText.toLowerCase();

            const matchesCategory =
                selectedCategory === "all" || category === selectedCategory;
            const matchesSearch = content.includes(searchTerm);
            const show = matchesCategory && matchesSearch;

            card.classList.toggle("hidden", !show);

            if (show) visibleCount++;
        });

        if (noResults) {
            noResults.style.display =
                visibleCount === 0 ? "block" : "none";
        }
        if (resultsCount) {
            resultsCount.textContent =
                "Showing " + visibleCount + " article(s)";
        }
    }

    searchInput.addEventListener("input", filterBlogs);

    categoryButtons.forEach((button) => {
        button.addEventListener("click", () => {
            categoryButtons.forEach((item) => {
                item.classList.remove("active");
            });
            button.classList.add("active");
            selectedCategory = button.dataset.category;
            filterBlogs();
        });
    });
}

/* ---------- Newsletter Form (blog.html only) ---------- */
const newsletterForm = document.getElementById("newsletterForm");
const newsletterMessage = document.getElementById("newsletterMessage");
const newsletterEmail = document.getElementById("newsletterEmail");

if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
        e.preventDefault();

        if (!newsletterEmail.checkValidity()) {
            newsletterEmail.reportValidity();
            return;
        }

        const subscriptionMessage =
            `Hello Aligned Bones, I would like to subscribe to clinic updates.\n` +
            `Email address: ${newsletterEmail.value.trim()}`;
        const whatsappURL =
            "https://wa.me/918296325500?text=" +
            encodeURIComponent(subscriptionMessage);

        window.open(whatsappURL, "_blank", "noopener,noreferrer");
        if (newsletterMessage) {
            newsletterMessage.style.display = "block";
        }
    });
}

/* ---------- Minimum Appointment Date (booking.html only) ---------- */
const dateInput = document.getElementById("appointmentDate");
if (dateInput) {
    const today = new Date();
    const localToday = new Date(
        today.getTime() - today.getTimezoneOffset() * 60000
    ).toISOString().split("T")[0];
    dateInput.min = localToday;
}

/* ---------- Booking Form -> WhatsApp (booking.html only) ---------- */
const bookingForm = document.getElementById("bookingForm");
if (bookingForm) {
    bookingForm.addEventListener("submit", function (e) {
        e.preventDefault();

        if (!this.reportValidity()) return;

        const name = document.getElementById("patientName").value.trim();
        const phone = document.getElementById("patientPhone").value.trim();
        const email = document.getElementById("patientEmail").value.trim();
        const age = document.getElementById("patientAge").value;
        const consultation = document.getElementById("consultation").value;
        const doctor = document.getElementById("doctor").value;
        const date = document.getElementById("appointmentDate").value;
        const time = document.getElementById("appointmentTime").value;
        const message = document.getElementById("patientMessage").value.trim();

        const whatsappMessage =
            `Hello Aligned Bones,\n\n` +
            `I would like to request an appointment.\n\n` +
            `Patient Name: ${name}\n` +
            `Mobile Number: ${phone}\n` +
            `Email: ${email || "Not provided"}\n` +
            `Age: ${age || "Not provided"}\n` +
            `Consultation Type: ${consultation}\n` +
            `Preferred Doctor: ${doctor}\n` +
            `Preferred Date: ${date}\n` +
            `Preferred Time: ${time}\n\n` +
            `Health Concern / Message:\n` +
            `${message || "Not provided"}\n\n` +
            `Please confirm the appointment availability. Thank you.`;

        const whatsappURL =
            "https://wa.me/918296325500?text=" +
            encodeURIComponent(whatsappMessage);

        window.open(whatsappURL, "_blank");
    });
}

/* ---------- Contact Form -> WhatsApp (contact.html only) ---------- */
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        if (!this.reportValidity()) return;

        const name = document.getElementById("fullName").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const email = document.getElementById("email").value.trim();
        const subject = document.getElementById("subject").value;
        const message = document.getElementById("message").value.trim();

        const whatsappMessage =
            `Hello Aligned Bones,\n\n` +
            `I would like to make an enquiry.\n\n` +
            `Name: ${name}\n` +
            `Phone: ${phone}\n` +
            `Email: ${email}\n` +
            `Enquiry Type: ${subject}\n\n` +
            `Message:\n` +
            `${message}`;

        const whatsappURL =
            "https://wa.me/918296325500?text=" +
            encodeURIComponent(whatsappMessage);

        if (formMessage) {
            formMessage.style.display = "block";
        }

        window.open(whatsappURL, "_blank");
    });
}

// Open policy details when a footer policy link targets this page.
(function(){
  var target = document.getElementById(window.location.hash.slice(1));
  if (target && target.matches('details.embedded-legal')) {
    target.open = true;
    window.requestAnimationFrame(function(){ target.scrollIntoView({behavior:'smooth', block:'start'}); });
  }
})();

/* ---------- Scroll Progress Bar ---------- */
const progressBar = document.createElement("div");
progressBar.className = "scroll-progress";
document.body.appendChild(progressBar);

window.addEventListener("scroll", () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height ? (winScroll / height) * 100 : 0;
    progressBar.style.width = scrolled + "%";
});

/* ---------- Hero Parallax on Scroll ---------- */
const hero = document.querySelector(".home-hero");
const heroBgLayers = document.querySelectorAll(".hero-bg-layer");
const heroContent = document.querySelector(".hero-content");

function parallaxHero() {
    if (!hero) return;
    const scrollTop = window.pageYOffset;
    const heroTop = hero.offsetTop;
    const heroHeight = hero.offsetHeight;
    const heroBottom = heroTop + heroHeight;

    if (scrollTop < heroBottom) {
        const percentage = Math.max(0, Math.min(1, (scrollTop - heroTop) / heroHeight));

        heroBgLayers.forEach((layer) => {
            const speed = layer.classList.contains("slow") ? 0.15 : 0.08;
            const translateY = percentage * 40 * speed;
            const scale = 1 + percentage * 0.05 * speed;
            layer.style.transform = `scale(${scale}) translateY(${translateY}px)`;
        });

        if (heroContent) {
            heroContent.style.transform = `translateY(${percentage * 30}px)`;
            heroContent.style.opacity = 1 - percentage * 0.4;
        }
    }
}

window.addEventListener("scroll", parallaxHero);

/* ---------- Mouse Tracking Parallax ---------- */
document.addEventListener("mousemove", (e) => {
    const x = (window.innerWidth - e.pageX * 2) / 120;
    const y = (window.innerHeight - e.pageY * 2) / 120;

    heroBgLayers.forEach((layer) => {
        const speed = layer.classList.contains("slow") ? 1.5 : 1;
        let baseTransform = layer.style.transform;
        baseTransform = baseTransform.replace(/translateX\([^)]*\)/, "").replace(/translateY\([^)]*\)/, "");
        layer.style.transform = baseTransform + ` translateX(${x * speed}px) translateY(${y * speed}px)`;
    });
});

/* ---------- Patient feedback marquee ---------- */
(function initTestimonialMarquee() {
    const carousel = document.querySelector('[data-testimonial-carousel]');
    if (!carousel) return;

    const track = carousel.querySelector('.testimonial-track');
    const sourceGroup = track && track.querySelector('.testimonial-group');
    if (!track || !sourceGroup) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduceMotion.matches) return;

    const duplicate = sourceGroup.cloneNode(true);
    duplicate.setAttribute('aria-hidden', 'true');
    duplicate.querySelectorAll('a, button, input, [tabindex]').forEach((element) => {
        element.setAttribute('tabindex', '-1');
    });
    track.appendChild(duplicate);

    const setDuration = () => {
        const pixelsPerSecond = 38;
        const duration = Math.max(32, sourceGroup.scrollWidth / pixelsPerSecond);
        track.style.setProperty('--testimonial-duration', `${duration}s`);
    };

    setDuration();
    window.addEventListener('resize', setDuration, { passive: true });
})();
