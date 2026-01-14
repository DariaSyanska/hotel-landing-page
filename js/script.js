/* =========================================
   1. GLOBAL VARIABLES & DOM ELEMENTS
   ========================================= */
const preloader = document.getElementById("preloader");
const header = document.querySelector(".header");
const menuToggle = document.getElementById("mobile-menu");
const nav = document.querySelector(".header_nav");
const menuIcon = menuToggle.querySelector("i");
const mybutton = document.getElementById("scrollToTopBtn");
const copyrightElement = document.getElementById("copyright");

const checkinInput = document.getElementById("checkin");
const checkoutInput = document.getElementById("checkout");
const roomSelect = document.getElementById("roomType");
const priceDisplay = document.getElementById("price-display");
const totalPriceEl = document.getElementById("total-price-value");
const nightsCountEl = document.getElementById("nights-count");

/* =========================================
   2. INITIALIZATION (Libraries)
   ========================================= */
AOS.init({
  duration: 1000,
  once: true,
});

const lightbox = GLightbox({
  touchNavigation: true,
  loop: true,
  autoplayVideos: true,
});

/* =========================================
   3. PRELOADER & PAGE LOAD
   ========================================= */
window.addEventListener("load", () => {
  if (preloader) {
    preloader.classList.add("hide");
  }
});

/* =========================================
   4. HEADER & SCROLL LOGIC
   ========================================= */
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.style.backgroundColor = "rgba(0, 0, 0, 0.95)";
    header.style.padding = "10px 0";
  } else {
    header.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    header.style.padding = "15px 0";
  }

  if (
    document.body.scrollTop > 200 ||
    document.documentElement.scrollTop > 200
  ) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
});

mybutton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* =========================================
   5. MOBILE MENU
   ========================================= */
menuToggle.addEventListener("click", () => {
  nav.classList.toggle("active");
  toggleMenuIcon();
});

document.querySelectorAll(".nav-list a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("active");
    toggleMenuIcon();
  });
});

function toggleMenuIcon() {
  if (nav.classList.contains("active")) {
    menuIcon.classList.remove("fa-bars");
    menuIcon.classList.add("fa-times");
  } else {
    menuIcon.classList.remove("fa-times");
    menuIcon.classList.add("fa-bars");
  }
}

/* =========================================
   6. DYNAMIC COPYRIGHT YEAR
   ========================================= */
if (copyrightElement) {
  const year = new Date().getFullYear();
  copyrightElement.innerHTML = `© ${year} LOFT HOTEL. All rights reserved.`;
}

/* =========================================
   7. BOOKING LOGIC (Dates & Price)
   ========================================= */
const today = new Date().toISOString().split("T")[0];
if (checkinInput && checkoutInput) {
  checkinInput.setAttribute("min", today);
  checkoutInput.setAttribute("min", today);
}

function handleDateChange() {
  const checkinDate = checkinInput.value;
  checkoutInput.setAttribute("min", checkinDate);

  if (checkoutInput.value && checkoutInput.value < checkinDate) {
    checkoutInput.value = "";
  }

  calculatePrice();
}

function calculatePrice() {
  if (!checkinInput || !checkoutInput || !roomSelect) return;

  const checkinDate = new Date(checkinInput.value);
  const checkoutDate = new Date(checkoutInput.value);
  const roomPrice = parseInt(roomSelect.value);

  if (
    checkinInput.value &&
    checkoutInput.value &&
    !isNaN(roomPrice) &&
    checkoutDate > checkinDate
  ) {
    const timeDiff = checkoutDate - checkinDate;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (daysDiff > 0) {
      const total = daysDiff * roomPrice;
      totalPriceEl.textContent = `$${total}`;
      nightsCountEl.textContent = `(${daysDiff} nights)`;
      priceDisplay.classList.add("visible");
    }
  } else {
    priceDisplay.classList.remove("visible");
  }
}

if (checkinInput && checkoutInput && roomSelect) {
  checkinInput.addEventListener("change", handleDateChange);
  checkoutInput.addEventListener("change", calculatePrice);
  roomSelect.addEventListener("change", calculatePrice);
}

/* =========================================
   8. HANDLE FORM SUBMISSION (AJAX)
   ========================================= */
const bookingForm = document.getElementById("bookingForm");

if (bookingForm) {
  bookingForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const submitBtn = document.getElementById("submitBtn");
    const originalText = submitBtn.innerText;

    submitBtn.innerText = "Sending...";
    submitBtn.disabled = true;

    const formData = new FormData(bookingForm);

    try {
      const response = await fetch(bookingForm.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        bookingForm.reset();
        window.location.href = "success.html";
      } else {
        alert("Oops! There was a problem submitting your form");
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
      }
    } catch (error) {
      alert("Oops! There was a problem submitting your form");
      submitBtn.innerText = originalText;
      submitBtn.disabled = false;
    }
  });
}
