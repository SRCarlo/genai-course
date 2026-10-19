import { app } from './app.js';
import { config } from './config/config.js';
import { logger } from './observability/logger.js';

const server = app.listen(config.port, () => {
  logger.info({ port: config.port, model: config.groqModel }, 'Day 120 GenAI SaaS API started');
});

function shutdown(signal) {
  logger.info({ signal }, 'Shutdown requested');
  server.close((error) => {
    if (error) {
      logger.error({ err: error }, 'Server shutdown failed');
      process.exitCode = 1;
    }
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
