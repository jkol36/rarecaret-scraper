import { expect } from 'chai'
import {
  postUserQuery,
  fetchResultsForQuery
} from './helpers'
import {
  initializeDatabase
} from './config'
require('./config')
import mongoose from 'mongoose'
import {store} from './store'
const { dispatch } = store



describe('rare carat database', () => {
  before(done => {
    mongoose.connect(process.env.TEST_DATABASE_URL)
    .then(() => {
      let models = ['carat','rareCaratDiamond']
      let promises = Promise.map(models, model => {
        return mongoose.model(model).remove({})
      return Promise.all(promises)
      })
    })
    .then(done)
    .catch(done)
  })
  after(done => {
    mongoose.disconnect().then(done)
  })
  it('should remove default carat', done => {
    mongoose.model('carat')
    .remove({})
    .then(() => done())
    .catch(done)
  })
  it('should find rare carat diamonds ', done => {
    mongoose
    .model('rareCaratDiamond')
    .find({})
    .then(res => {
      expect(res).to.be.an('array')
      expect(res.length).to.eq(0)
      done()
    })
  })
  it('should get main carat ', done => {
    mongoose.model('carat').getMain()
    .then(res => {
      expect(res.carat).to.be.a('number')
      expect(res.carat).to.eq(0.3)
      done()
    })
  })
  it('should increment main carat ', done => {
    mongoose.model('carat').increment(0.05)
    .then(res => {
      expect(res.carat).to.be.a('number')
      expect(res.carat).to.eq(0.35)
      done()
    })
  })
  it('should remove rare carat diamonds from mongo', done => {
    mongoose
    .model('rareCaratDiamond')
    .remove({})
    .then(res => {
      expect(res).to.be.ok
      done()
    })

  })

})
describe('rare carat scraper', () => {
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
  it('should return a new filters object with carat min value changed', done => {
    let newFilters = Object.assign({}, filters, {Carats:{Min:0.20}})
    let {Carats:{Min}} = newFilters
    expect(Min).to.not.be.eq(filters.Carats.Min)
    console.log(filters.Carats.Min)
    console.log(newFilters.Carats.Min)
    done()
  })
  it('should fetch rarecaret diamonds for weight 0.31', done => {
    postUserQuery(0.33)
    .then(fetchResultsForQuery)
    .then(res => {
      expect(res).to.be.ok
      console.log(res)
      done()
    })
  })
})