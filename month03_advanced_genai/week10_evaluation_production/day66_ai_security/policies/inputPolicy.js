import dotenv from "dotenv";

dotenv.config({ quiet: true });

export const inputPolicy = {
  maxLength: Number(
    process.env.MAX_INPUT_LENGTH || 5000
  ),

  minLength: 1,

  rejectEmpty: true,

  allowControlCharacters: false,

  suspiciousPatterns: [
  /ignore\s+(all\s+)?previous\s+instructions?/i,

  /disregard\s+(all\s+)?previous\s+(instructions?|rules?)/i,

  /forget\s+(all\s+)?previous\s+(instructions?|rules?)/i,

  /override\s+(the\s+)?(system|security|previous)\s+(instructions?|rules?)/i,

  /forget\s+(all\s+)?security\s+(rules?|instructions?)/i,

  /ignore\s+(all\s+)?security\s+(rules?|instructions?)/i,

  /disregard\s+(all\s+)?security\s+(rules?|instructions?)/i,

  /bypass\s+(the\s+)?security\s+(rules?|controls?|policy)/i,

  /disable\s+(the\s+)?security\s+(rules?|controls?|policy)/i,

  /reveal\s+(your\s+)?(system|hidden)\s+prompt/i,

  /show\s+(me\s+)?(your\s+)?(system|hidden)\s+prompt/i,

  /tell\s+me\s+(your\s+)?(system|hidden)\s+prompt/i,

  /reveal\s+(your\s+)?(internal|hidden)\s+instructions?/i,

  /show\s+(me\s+)?(your\s+)?(internal|hidden)\s+instructions?/i,

  /developer\s+mode/i,

  /unrestricted\s+(mode|assistant|ai)/i,

  /jailbreak/i,

  /you\s+are\s+now\s+an?\s+unrestricted/i,

  /your\s+(previous\s+)?instructions?\s+(no\s+longer\s+apply|are\s+invalid)/i,

  /follow\s+my\s+instructions?\s+instead/i
]

};

export function getInputPolicy() {
  return inputPolicy;
}
