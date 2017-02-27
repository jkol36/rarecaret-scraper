import mongoose from 'mongoose'
global.Promise = require('bluebird')
mongoose.Promise = require('bluebird')
require('./models')

if(process.env.NODE_ENV != 'production')
  require('dotenv').load()
export const initializeDatabase = () => {
  return mongoose.connect(process.env.DATABASE_URL)
}

export const defaultCarat = 0.30
export const caratIncrement = 0.01
