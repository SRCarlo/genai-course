import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',

  base: {
    service: process.env.SERVICE_NAME || 'genai-saas-api',
    environment: process.env.NODE_ENV || 'development',
  },

  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'headers.authorization',
      'headers.cookie',
      'apiKey',
      'api_key',
      'password',
      'accessToken',
      'refreshToken',
      'GROQ_API_KEY',
    ],
    censor: '[REDACTED]',
  },
});
