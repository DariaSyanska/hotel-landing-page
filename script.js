const form = document.getElementById("bookingForm");
const submitBtn = document.getElementById("submitBtn");

const fields = {
  name: document.getElementById("name"),
  email: document.getElementById("email"),
  checkin: document.getElementById("checkin"),
  checkout: document.getElementById("checkout"),
  roomType: document.getElementById("roomType"),
};

const errors = {
  name: document.getElementById("nameError"),
  email: document.getElementById("emailError"),
  checkin: document.getElementById("checkinError"),
  checkout: document.getElementById("checkoutError"),
  date: document.getElementById("dateError"),
  roomType: document.getElementById("roomTypeError"),
};

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validateForm() {
  let isValid = true;

  // Validate name
  if (fields.name.value.trim() === "") {
    errors.name.classList.add("visible");
    isValid = false;
  } else {
    errors.name.classList.remove("visible");
  }

  // Validate email
  if (!isValidEmail(fields.email.value.trim())) {
    errors.email.classList.add("visible");
    isValid = false;
  } else {
    errors.email.classList.remove("visible");
  }

  // Validate check-in date
  if (fields.checkin.value === "") {
    errors.checkin.classList.add("visible");
    isValid = false;
  } else {
    errors.checkin.classList.remove("visible");
  }

  // Validate check-out date
  if (fields.checkout.value === "") {
    errors.checkout.classList.add("visible");
    isValid = false;
  } else {
    errors.checkout.classList.remove("visible");
  }

  // Validate date order
  if (fields.checkin.value && fields.checkout.value) {
    if (fields.checkout.value <= fields.checkin.value) {
      errors.date.classList.add("visible");
      isValid = false;
    } else {
      errors.date.classList.remove("visible");
    }
  } else {
    errors.date.classList.remove("visible");
  }

  // Validate room type selection
  if (fields.roomType.value === "") {
    errors.roomType.classList.add("visible");
    isValid = false;
  } else {
    errors.roomType.classList.remove("visible");
  }

  // Enable or disable submit button
  submitBtn.disabled = !isValid;
  submitBtn.classList.toggle("opacity-50", !isValid);
  submitBtn.classList.toggle("cursor-not-allowed", !isValid);

  return isValid;
}

// Add input event listeners for real-time validation
Object.values(fields).forEach(field => {
  field.addEventListener("input", validateForm);
});

// Handle form submission
form.addEventListener("submit", event => {
  event.preventDefault();

  if (!validateForm()) return;

  alert(`Thank you, ${fields.name.value}! Your booking for a ${fields.roomType.value} from ${fields.checkin.value} to ${fields.checkout.value} has been received.`);

  form.reset();
  validateForm();
});

// Initialize button state on page load
validateForm();