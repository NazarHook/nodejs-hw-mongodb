<<<<<<< Updated upstream
=======
import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import contactsRouter from './services/contacts.js';
import logger from './logger.js';

const setupServer = () => {
  const app = express();
  app.use(cors());
  app.use(pinoHttp({ logger }));

  app.use('/contacts', contactsRouter);

  app.use((req, res, next) => {
    res.status(404).json({ message: 'Not found' });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
};

export default setupServer;
>>>>>>> Stashed changes
