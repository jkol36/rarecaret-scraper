import { expect } from 'chai'
import {
  postUserQuery,
  fetchResultsForQuery
} from './helpers'
import {
  initializeDatabase
} from './config'
require('./config')
import {
  buildFilter,
  removeFile,
  writeHeadersToCsv,
  createCsvFileWriter,
  addFile,
  fileExists
} from './utils'
import mongoose from 'mongoose'
import {store} from './store'
const { dispatch } = store



describe('rare caret database', () => {
  before(done => {
    mongoose.connect(process.env.TEST_DATABASE_URL)
    .then(() => {
      let models = ['count','rareCaratDiamond', 'idexDiamond']
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
  it('should remove default count', done => {
    mongoose.model('count')
    .remove({})
    .then(() => done())
    .catch(done)
  })
  it('should find rare count diamonds ', done => {
    mongoose
    .model('rareCaratDiamond')
    .find({})
    .then(res => {
      expect(res).to.be.an('array')
      expect(res.length).to.eq(0)
      done()
    })
  })
  it('should find idex diamonds', done => {
    mongoose
    .model('idexDiamond')
    .find({})
    .then(res => {
      expect(res).to.be.an('array')
      expect(res.length).to.eq(0)
      done()
    })
  })
  it('should get main count ', done => {
    mongoose.model('count').getMain()
    .then(res => {
      expect(res.count).to.be.a('number')
      expect(res.count).to.eq(0)
      done()
    })
  })
  it('should increment main count ', done => {
    mongoose.model('count').increment()
    .then(res => {
      expect(res.count).to.be.a('number')
      expect(res.count).to.eq(1)
      console.log(res.count)
      done()
    })
  })
  it('should remove rare caret diamonds from mongo', done => {
    mongoose
    .model('rareCaratDiamond')
    .remove({})
    .then(res => {
      expect(res).to.be.ok
      done()
    })
  })
  it('should add an idex diamond', done => {
    mongoose
    .model('idexDiamond')
    .create({name:'testing'})
    .then(res => {
      console.log(res)
      expect(res).to.be.ok
      done()
    })
  })
  it('should find all idex diamonds', done => {
    mongoose
    .model('idexDiamond')
    .find({})
    .then(res => {
      expect(res).to.be.ok
      expect(res).to.be.an('array')
      done()
    })
  })

})
describe('rare caret scraper', () => {
  let idexDiamond = {"Item ID #":"118877724","Supplier Stock Ref":"CER024445","Cut":"Round","Carat":"0.5","Color":"I","Natural Fancy Color":"","Natural Fancy Color Intensity":"","Natural Fancy Color Overtone":"","Treated Color":"","Clarity":"SI1","Make (Cut Grade)":"Excellent","Grading Lab":"GIA","Certificate Number":"6241467581","Certificate Path":"http://DiamondTransactions.net/icp?di=118877724","Image Path":"","Online Report":"","Price Per Carat":"1575","Total Price":"787.5","Polish":"Excellent","Symmetry":"Very Good","Measurements (LengthxWidthxHeight)":"5.12x5.08x3.17","Depth":"62.2","Table":"58","Crown Height":"15","Pavilion Depth":"43.5","Girdle (From / To)":"Medium / Slightly Thick","Culet Size":"None","Culet Condition":"","Graining":"","Fluorescence Intensity":"None","Fluorescence Color":"","Enhancement":"","Supplier":"Y.D.I - Yoshfe Diamonds International Ltd","Country":"Israel","State / Region":"","Remarks":"","Phone":"-2276301","Pair Stock Ref.":"","Email":"motti.c@ydiltd.com","priceVariance":"0.8115345005","rareCaretPrice":"971","idexPrice":"787.5","% Diff":"18.90%"}
  it('should build a filter for a idex diamond', done => {
    let filter = buildFilter(idexDiamond)
    expect(filter).to.be.an('object')
    done()
  })
  it('should fetch rarecaret diamonds for a filter', done => {
    let filter = buildFilter(idexDiamond)
    postUserQuery(filter)
    .then(fetchResultsForQuery)
    .map(res => {
      expect(res).to.be.ok
      return res
    })
    .then(() => done())
  })
  it('should check to see if a file exists', done => {
    fileExists('testing.csv')
    .then(exists => {
      console.log(`file exists? ${exists}`)
      expect(exists).to.eq.false
      done()
    })
    .catch(done)
  })
  it('should create a file', done => {
    addFile('testing.csv')
    .then(res => {
      console.log('got res', res)
      return fileExists('testing.csv')
    })
    .then(exists => {
      console.log(exists)
      expect(exists).to.eq.true
      done()
    })
    .catch(done)
  })
  it('should remove results.csv if it exists', done => {
    removeFile('./results.csv')
    .then(res => {
      expect(res).to.be.ok
      done()
    })
    .catch(done)
  })
  it('should write headers to the csv', done => {
    const headersForCsv = ['idex id', 'idex price', 'rare caret price', 'price variance', 'count', 'cheaper rare caret diamond', 'idex diamond']
    const writer = createCsvFileWriter('test')
    writeHeadersToCsv(headersForCsv, writer)
    .then(res => {
      expect(res).to.be.ok
      done()
    })
  })
})
