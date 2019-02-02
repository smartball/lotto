import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import billController from 'routes/bill'
import { healthCheck } from 'routes/helloworld'
import ticketController from 'routes/ticket'
import creditController from 'routes/credit'
import logger from 'utils/logger'
import { config } from './config'
import createConnection from './database/connection'
import mongoose from 'mongoose'
import auth from './middlewares/auth'
import {scheduleRenewUniqueCode} from './config/schedule'
let isConnected = false
const app = express()
const middleware = [
  cors(),
  bodyParser.urlencoded({ extended: false }),
  bodyParser.json(),
  // auth
]

const configDatabase = () => {
  const url = 'mongodb://superball:ball1234@ds119755.mlab.com:19755/beyond'
  try {
    mongoose.connect(url)
    mongoose.Promise = global.Promise
    const dbConnect = mongoose.connection
    dbConnect.on('connected', (ref) => {
      isConnected = true
      console.log('Connected to mongo server.')
    })
    return dbConnect
  } catch (err) {
    console.log('connect fail')
  }
}
// scheduleRenewUniqueCode()
app.use(middleware)
app.listen(8080, (error) => {
  if (error) {
    // logger.error(error)
    process.exit(1)
  }
  configDatabase()
 
})

app.get('/', healthCheck)
app.use('/api/bill', billController)
app.use('/api/ticket', ticketController)
app.use('/api/credit', creditController)
