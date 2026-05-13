/* =========================================================
   MOSQITER LANDING PAGE JS
   Menú móvil, scroll suave, animaciones, validación y WhatsApp.
   ========================================================= */

// Cambia este número por el WhatsApp real de Mosqiter.
// Formato recomendado: prefijo país + número, sin espacios ni símbolos.
const WHATSAPP_NUMBER = "34600000000";
const WHATSAPP_MESSAGE = "Hola, quiero pedir información sobre Mosqiter para mi negocio.";

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const whatsappFloat = document.getElementById("whatsappFloat");
const contactForm = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");

// ================= MENÚ MÓVIL =================
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.classList.toggle("active", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

// Cierra el menú móvil al hacer clic en cualquier enlace.
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// ================= SCROLL SUAVE =================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const targetId = anchor.getAttribute("href");

    // Evita errores con enlaces vacíos como "#".
    if (!targetId || targetId.length <= 1 || !targetId.startsWith("#")) return;

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// ================= ANIMACIONES AL APARECER =================
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -40px 0px",
  }
);

revealElements.forEach((element) => revealObserver.observe(element));

// ================= WHATSAPP FLOTANTE =================
function setupWhatsAppButton() {
  const encodedMessage = encodeURIComponent(WHATSAPP_MESSAGE);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

  whatsappFloat.setAttribute("href", whatsappUrl);
}

setupWhatsAppButton();

// ================= VALIDACIÓN FORMULARIO =================
function getFieldWrapper(field) {
  // En los campos de dos columnas, el wrapper real es el div interno.
  const parent = field.parentElement;
  if (parent && parent.parentElement && parent.parentElement.classList.contains("two-columns")) {
    return parent;
  }

  return field.closest(".form-row") || parent;
}

function setError(field, message) {
  const wrapper = getFieldWrapper(field);
  const errorMessage = wrapper.querySelector(".error-message");

  wrapper.classList.add("error");
  if (errorMessage) errorMessage.textContent = message;
}

function clearError(field) {
  const wrapper = getFieldWrapper(field);
  const errorMessage = wrapper.querySelector(".error-message");

  wrapper.classList.remove("error");
  if (errorMessage) errorMessage.textContent = "";
}

function isValidPhone(phone) {
  // Validación básica: permite espacios, + y números. Mínimo 9 dígitos reales.
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 9;
}

function validateForm() {
  let isValid = true;
  const requiredFields = contactForm.querySelectorAll("input[required], textarea[required]");

  requiredFields.forEach((field) => {
    clearError(field);

    if (!field.value.trim()) {
      setError(field, "Este campo es obligatorio.");
      isValid = false;
      return;
    }

    if (field.id === "phone" && !isValidPhone(field.value)) {
      setError(field, "Introduce un teléfono válido.");
      isValid = false;
    }
  });

  return isValid;
}

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formSuccess.textContent = "";

  if (!validateForm()) return;

  const formData = new FormData(contactForm);
  const name = formData.get("name");
  const business = formData.get("business");
  const city = formData.get("city");
  const phone = formData.get("phone");
  const message = formData.get("message");

  // Al no usar backend, abrimos WhatsApp con los datos del formulario.
  const whatsappText = `Hola, quiero pedir información sobre Mosqiter.

Nombre: ${name}
Negocio: ${business}
Ciudad: ${city}
Teléfono: ${phone}
Mensaje: ${message}`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappText)}`;

  formSuccess.textContent = "Solicitud preparada. Te abrimos WhatsApp para enviarla.";
  contactForm.reset();

  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
});

// Limpia errores mientras el usuario escribe.
contactForm.querySelectorAll("input, textarea").forEach((field) => {
  field.addEventListener("input", () => clearError(field));
});
