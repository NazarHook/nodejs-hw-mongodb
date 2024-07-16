import setupServer from './server'
import initMongoConnection from './db/initMongoConnection'

const startApp = async () => {
  await initMongoConnection()
  setupServer()
}

startApp()
