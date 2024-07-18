<<<<<<< Updated upstream
=======
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const { MONGODB_URL, MONGODB_USER, MONGODB_PASSWORD, MONGODB_DB } = process.env;
const initMongoConnection = async () => {
  try {
    const connectionString = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;
    await mongoose.connect(connectionString)
    console.log('MongoDB connection successfully established!');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    throw new Error('Unable to connect to MongoDB');
  }
};

export default initMongoConnection;
>>>>>>> Stashed changes
