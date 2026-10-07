// Mobilmenu
const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('menu');
toggle.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
menu.querySelectorAll('a').forEach((link) =>
  link.addEventListener('click', () => {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  })
);

// Fade-in ved scroll
const observer = new IntersectionObserver(
  (entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  }),
  { threshold: 0.15 }
);
document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

document.getElementById('year').textContent = new Date().getFullYear();

// Kontaktformular
// Apps Script-postkassen (kontaktformular/Code.gs) sender beskeden som e-mail til ejerens Gmail.
const FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzV8F_k1hHZvH5h6sRMqo8mdHtwwKQcuOgxzILuujdZe6UHoIlX57Kccgnnz6oOzQ_c/exec';

const MESSAGES = {
  da: {
    invalid: 'Udfyld venligst navn, en gyldig e-mail og en besked.',
    sending: 'Sender …',
    sent: 'Tak for din besked! Jeg vender tilbage hurtigst muligt.',
    failed: 'Beskeden kunne ikke sendes. Prøv igen om lidt.',
  },
  en: {
    invalid: 'Please enter your name, a valid email and a message.',
    sending: 'Sending …',
    sent: 'Thank you for your message! I will get back to you as soon as possible.',
    failed: 'The message could not be sent. Please try again shortly.',
  },
};
const msg = MESSAGES[document.documentElement.lang] || MESSAGES.da;

const form = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');

function setStatus(text, type) {
  statusEl.textContent = text;
  statusEl.className = 'form-status' + (type ? ' ' + type : '');
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    setStatus(msg.invalid, 'error');
    form.reportValidity();
    return;
  }

  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  setStatus(msg.sending);

  try {
    const response = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      body: new URLSearchParams(new FormData(form)),
    });
    const result = await response.json();
    if (!result.ok) throw new Error(result.error || 'Ukendt fejl');
    form.reset();
    setStatus(msg.sent, 'ok');
  } catch (err) {
    setStatus(msg.failed, 'error');
  } finally {
    button.disabled = false;
  }
});
