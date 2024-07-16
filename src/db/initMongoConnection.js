import mongoose from 'mongoose'

const initMongoConnection = async () => {
  const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env
  const mongoURI = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}`

  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    console.log('Mongo connection successfully established!')
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
  }
}

export default initMongoConnection
