import pino from 'pino';
import { config } from '../config/config.js';

export const logger = pino({
  level: config.logLevel,
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'GROQ_API_KEY',
      'apiKey',
      'document.content',
      'context',
    ],
    censor: '[REDACTED]',
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});
