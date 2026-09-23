const EMAIL_REGEX = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;

const PHONE_REGEX =
  /(?:\+?\d{1,3}[\s.-]?)?(?:\d{3}[\s.-]?\d{3}[\s.-]?\d{4})\b/g;

export function detectEmail(text) {
  EMAIL_REGEX.lastIndex = 0;
  return EMAIL_REGEX.test(text);
}

export function detectPhone(text) {
  PHONE_REGEX.lastIndex = 0;
  return PHONE_REGEX.test(text);
}

export function detectPII(text) {
  return {
    email: detectEmail(text),
    phone: detectPhone(text),
  };
}
