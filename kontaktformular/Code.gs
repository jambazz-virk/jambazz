/**
 * Postkasse til kontaktformularen på jambazz.dk
 *
 * Kører som en Google Apps Script-webapp på ejerens egen Google-konto.
 * Modtager beskeder fra formularen og sender dem som e-mail til kontoens
 * egen Gmail med "+github"-mærket (fx navn+github@gmail.com). Adressen
 * står derfor hverken i koden eller på hjemmesiden.
 *
 * Udrulning: se kontaktformular/README.md
 */

const MAX_MESSAGE_LENGTH = 5000;
const MAX_MAILS_PER_HOUR = 20;
const RECIPIENT_TAG = 'github';

/** Svar ved almindeligt besøg på webappens adresse, så man kan se, at den kører. */
function doGet() {
  return json_({ ok: true, status: 'jambazz-kontakt kører' });
}

function doPost(e) {
  try {
    const p = (e && e.parameter) || {};

    // Spam-fælde: feltet er skjult for mennesker og skal være tomt
    if (p._honey) return json_({ ok: true });

    const name = clean_(p.name, 100);
    const email = clean_(p.email, 200);
    const message = clean_(p.message, MAX_MESSAGE_LENGTH);
    const lang = p.lang === 'en' ? 'EN' : 'DA';

    if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json_({ ok: false, error: 'Ugyldige felter' });
    }

    if (!withinRateLimit_()) {
      return json_({ ok: false, error: 'For mange henvendelser' });
    }

    MailApp.sendEmail({
      to: recipient_(),
      replyTo: email,
      name: 'jambazz.dk',
      subject: 'jambazz.dk (' + lang + '): Ny besked fra ' + name,
      body: 'Navn: ' + name + '\nE-mail: ' + email + '\n\n' + message
    });

    return json_({ ok: true });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'Serverfejl: ' + err.message });
  }
}

/** Kontoens egen adresse med +mærke, fx navn@gmail.com -> navn+github@gmail.com */
function recipient_() {
  return Session.getEffectiveUser().getEmail().replace('@', '+' + RECIPIENT_TAG + '@');
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

/** Kør denne én gang fra editoren for at godkende adgang og sende en testmail. */
function testMail() {
  MailApp.sendEmail(recipient_(), 'jambazz.dk: Testmail fra kontaktformularen', 'Det virker!');
}

/** Kør denne fra editoren for at afprøve doPost med en testbesked og se resultatet i loggen. */
function testDoPost() {
  const result = doPost({ parameter: { name: 'Test', email: 'test@example.com', message: 'Testbesked', lang: 'da' } });
  console.log(result.getContent());
}
