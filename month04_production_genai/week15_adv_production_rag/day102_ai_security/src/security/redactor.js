const EMAIL_REGEX = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;

const PHONE_REGEX =
  /(?:\+?\d{1,3}[\s.-]?)?(?:\d{3}[\s.-]?\d{3}[\s.-]?\d{4})\b/g;

export function redactEmails(text) {
  return text.replace(EMAIL_REGEX, "[REDACTED_EMAIL]");
}

export function redactPhones(text) {
  return text.replace(PHONE_REGEX, "[REDACTED_PHONE]");
}

export function redactPII(text) {
  return redactPhones(redactEmails(text));
}
