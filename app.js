import csv from 'ya-csv'
import {initializeDatabase, endCarat} from './config'
import { expect } from 'chai'
import {
  getDiamondsFromRareCaret,
  postUserQuery,
  fetchResultsForQuery
} from './helpers'

import {
  diamondsAddedRareCaret,
  caratChanged
} from './actionCreators'

import {
  store
} from './store'

import mongoose from 'mongoose'


const {getState, dispatch} = store

const convertCsvToJson = (filename, csv) => {
    return Promise.resolve(fs.createReadStream(csv)
    .pipe(csv2json({
      separator: ','
    }))
    .pipe(fs.createWriteStream(`${filename}.json`)))
}
const openIdexJsonFile = () => {
  return new Promise(resolve => {
    let json = require('./idex.json')
    resolve(json)
  })
}

const writeResultsToCsv = (results) => {
  return new Promise(resolve => {
    let writer = csv.createCsvFileWriter('stats.csv', {'flags': 'a'});
    writer.writeRecord(results)
    resolve()
  })
}
const start = () => {
  let {carat, rareCaretDiamonds} = getState()
  console.log(rareCaretDiamonds.length)
  console.log(carat)
  if(carat >= endCarat) {
    console.log('finished fetching all diamonds from rarecaret')
    console.log(rareCaretDiamonds.length)
    return Promise.resolve('done')
  }

  return postUserQuery(carat)
    .then(fetchResultsForQuery)
    .then(results => {
      return results
        .filter(result => result.Success === true &&
           result.Data.diamonds.length > 0)
        .map(obj => {
          writeResultsToCsv([
            carat,
            obj.Data.counts,
            obj.url,
            obj.Data.diamonds.length
          ])
          return obj.Data.diamonds
        })
        .reduce((a, b) => [...a, ...b])
    })
    .then(rareCaratDiamonds => {
      console.log('found rare caret diamonds', rareCaratDiamonds.length)
      return Promise.all(Promise.map(rareCaratDiamonds, rareCaratDiamond => {
        let {Carat} = rareCaratDiamond
        expect(Math.round(+Carat*100).toString()).to.eq(Math.round(+carat*100).toString())
        return Promise.resolve(rareCaratDiamond)
      }))
      .then(() => dispatch(caratChanged()))
      .then(() => dispatch(diamondsAddedRareCaret(rareCaratDiamonds)))
      .then(start)
    })
    .catch(console.log)
    
    


}
const writeHeadersToCsv = () => {
  let headers = ['currentWeight', 'theoreticalCount', 'site', 'trueCount']
  let writer = csv.createCsvFileWriter('stats.csv', {'flags': 'a'});
  writer.writeRecord(headers)
  return Promise.resolve()
}
const syncReduxWithMongooseData = () => {
  console.log('called')
  return mongoose.model('carat').getMain()
    .then(res => dispatch(caratChanged(+res.carat)))
}

const deleteMongoCollections = () => {
  return Promise.all([
    mongoose.model('carat').remove({}),
    mongoose.model('rareCaratDiamond').remove({})
  ])
}

const startFromScratch = () => {
  console.log('starting from scratch')
  return initializeDatabase()
  .then(deleteMongoCollections)
  .then(syncReduxWithMongooseData)
  .then(writeHeadersToCsv)
  .then(start)
  .catch(console.log)
}

initializeDatabase()
.then(syncReduxWithMongooseData)
.then(start)


