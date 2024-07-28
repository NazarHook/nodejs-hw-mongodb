import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import pino from 'pino-http'
import authRouter from './routers/auth-router.js';
import contactsRouter from './routers/contacts-router.js';
import notFoundHandler from './middlewares/notFoundHandler.js'
import errorHandler from './middlewares/errorHandler.js';
import cookieParser from "cookie-parser";
import { PUBLIC_DIR } from "./constants/index.js";
const setupServer = () => {
  const app = express();
  const logger = pino({ 
    transport: {
        target: "pino-pretty"
    }
});
app.use(logger)
app.use(cookieParser());
  app.use(cors());
  app.use(express.json())
  app.use(express.static(PUBLIC_DIR));
  app.use("/auth", authRouter);
  app.use('/contacts', contactsRouter);
  app.use(notFoundHandler)  
 app.use(errorHandler)
  const PORT = process.env.PORT || 3001;  
  app.listen(PORT, () => console.log(`Server running on ${PORT} PORT`))
};

export default setupServer;