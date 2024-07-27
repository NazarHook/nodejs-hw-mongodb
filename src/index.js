import setupServer from './server.js';
import initMongoConnection from './db/initMongoConnection.js';
import createDirIfNotExists from "./utils/createDirIfNotExists.js";

import { TEMP_UPLOAD_DIR, PUBLIC_DIR, PUBLIC_POSTERS_DIR } from "./constants/index.js";
const startApp = async () => {
    await initMongoConnection();
    await createDirIfNotExists(TEMP_UPLOAD_DIR);
    await createDirIfNotExists(PUBLIC_DIR);
    await createDirIfNotExists(PUBLIC_POSTERS_DIR);
    setupServer();
};
startApp();
