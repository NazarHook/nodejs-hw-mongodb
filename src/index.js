import setupServer from './server.js';
import initMongoConnection from './db/initMongoConnection.js';
import logger from './logger.js';

const startApp = async () => {
  try {
    await initMongoConnection();
    setupServer();
  } catch (error) {
    logger.error('Failed to start application:', error.message);
    process.exit(1);
  }
};


