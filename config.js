import mongoose from 'mongoose'
global.Promise = require('bluebird')
mongoose.Promise = require('bluebird')
require('./models')

if(process.env.NODE_ENV != 'production')
  require('dotenv').load()
const DATABASE_URL = 'mongodb://localhost/rarecaret_db'
export const initializeDatabase = () => {
  return mongoose.connect(DATABASE_URL)
}
