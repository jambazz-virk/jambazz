/**
 * Postkasse til kontaktformularen på jambazz.dk
 *
 * Modtager beskeder fra formularen og sender dem videre som e-mail til den
 * Google-konto, der har udrullet scriptet. Din e-mailadresse står derfor
 * hverken i koden eller på hjemmesiden.
 *
 * Udrulning: se kontaktformular/README.md
 */

const MAX_MESSAGE_LENGTH = 5000;
const MAX_MAILS_PER_HOUR = 20;

function doPost(e) {
  try {
    const p = (e && e.parameter) || {};

    // Spam-fælde: feltet "website" er skjult for mennesker og skal være tomt
    if (p.website) return json_({ ok: true });

    const name = clean_(p.name, 100);
    const email = clean_(p.email, 200);
    const message = clean_(p.message, MAX_MESSAGE_LENGTH);

    if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json_({ ok: false, error: 'Ugyldige felter' });
    }

    if (!withinRateLimit_()) {
      return json_({ ok: false, error: 'For mange henvendelser – prøv igen senere' });
    }

    MailApp.sendEmail({
      to: Session.getEffectiveUser().getEmail(),
      replyTo: email,
      subject: 'jambazz.dk: Ny besked fra ' + name,
      body: 'Navn: ' + name + '\nE-mail: ' + email + '\n\n' + message
    });

    return json_({ ok: true });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'Serverfejl' });
  }
}

function clean_(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength);
}

/** Bremser misbrug: højst MAX_MAILS_PER_HOUR mails i timen. */
function withinRateLimit_() {
  const lock = LockService.getScriptLock();
  lock.waitLock(5000);
  try {
    const cache = CacheService.getScriptCache();
    const count = Number(cache.get('mails') || 0);
    if (count >= MAX_MAILS_PER_HOUR) return false;
    cache.put('mails', String(count + 1), 3600);
    return true;
  } finally {
    lock.releaseLock();
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
