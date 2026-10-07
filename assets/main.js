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
// Adressen udfyldes, når Apps Script-postkassen (se kontaktformular/Code.gs) er udrullet.
const FORM_ENDPOINT = '';

const MESSAGES = {
  da: {
    invalid: 'Udfyld venligst navn, en gyldig e-mail og en besked.',
    inactive: 'Formularen er ikke aktiveret endnu. Prøv igen senere.',
    sending: 'Sender …',
    sent: 'Tak for din besked! Jeg vender tilbage hurtigst muligt.',
    failed: 'Beskeden kunne ikke sendes. Prøv igen om lidt.',
  },
  en: {
    invalid: 'Please enter your name, a valid email and a message.',
    inactive: 'The form is not active yet. Please try again later.',
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
  if (!FORM_ENDPOINT) {
    setStatus(msg.inactive, 'error');
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
