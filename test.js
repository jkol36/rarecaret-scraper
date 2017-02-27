import { expect } from 'chai'
import {
  getAllDiamonds
} from './helpers'
import {
  initializeDatabase
} from './config'
require('./config')
import mongoose from 'mongoose'


describe('rare caret database', () => {
  before(done => {
    mongoose.connect(process.env.DATABASE_URL)
    .then(done)
    .catch(done)
  })
  after(done => {
    mongoose.disconnect().then(done)
  })
  it('should remove default carat', done => {
    mongoose.model('caret')
    .remove({})
    .then(() => done())
    .catch(done)
  })
  it('should find rare caret diamonds ', done => {
    mongoose
    .model('rareCaretDiamond')
    .find({})
    .then(res => {
      expect(res).to.be.an('array')
      expect(res.length).to.eq(0)
      done()
    })
  })
  it('should get main caret ', done => {
    mongoose.model('caret').getMain()
    .then(res => {
      console.log(res)
      expect(res.carat).to.be.a('number')
      expect(res.carat).to.eq(0.3)
      done()
    })
  })
  it('should increment main caret ', done => {
    mongoose.model('caret').increment(0.05)
    .then(res => {
      console.log(res)
      expect(res.carat).to.be.a('number')
      expect(res.carat).to.eq(0.35)
      done()
    })
  })

})
describe('rare caret scraper', () => {
  const filters = {
    "Index":0,
    "PageSize":50,
    "Sorting":"Price",
    "Order":"asc",
    "Shapes":"CU,AS,RA,HS,OV,PR,EC,MQ,PS,RD",
    "Price":{
      "Min":250,
      "Max":2000000
    },
    "Cuts":{
      "Min":1,
      "Max":4
    },
    "Clarities":{
      "Min":0,
      "Max":8
    },
    "Carats":{
      "Min":0.15,
      "Max":15
    },
    "Colors":{
      "Min":0,
      "Max":8
    },
    "Certificate":{
      "Certi":"4"
    },
    "Fluor":{
      "Min":0,
      "Max":5
    },
    "Tables":{
      "Min":0,
      "Max":100
    },
    "Depths":{
      "Min":0,
      "Max":100
    },
    "Polish":{
      "Min":1,
      "Max":4
    },
    "Symmetry":{
      "Min":1,
      "Max":4
    },
    "LWratio":{
      "Min":0.5,
      "Max":2.75
    },
    "RequestNumber":1
  }
  it('should return a new filters object with caret min value changed', done => {
    let newFilters = Object.assign({}, filters, {Carats:{Min:0.20}})
    let {Carats:{Min}} = newFilters
    expect(Min).to.not.be.eq(filters.Carats.Min)
    console.log(filters.Carats.Min)
    console.log(newFilters.Carats.Min)
    done()
  })
})