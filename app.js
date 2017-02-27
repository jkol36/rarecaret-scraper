import {initializeDatabase, endCarat} from './config'
import {
  getDiamondsFromRareCaret,
  postUserQuery,
  fetchResultsForQuery
} from './helpers'

import {
  diamondsAddedRareCaret,
  diamondsAddedIdex,
  caratChanged
} from './actionCreators'

import {
  parseResults
} from './parser'

import {
  store
} from './store'

import csv2json from 'csv2json'
import fs from 'fs'
import mongoose from 'mongoose'


const {getState, dispatch} = store


const findDiamondsCheaperThanRareCaret = () => {
  const {rareCaretDiamonds, idexDiamonds} = getState()
  let cheaperThanRareCaret = []
  //for each idex diamond I need to find a sibling rare caret diamond for a specific Carat,
  //Once i find all siblings for that Caret meh come back to this.
  idexDiamonds.forEach(idexDiamond => {
    let {
      cut, 
      Carat, 
      Color, 
      Clarity, 
      Make,
      Polish,
      Symmetry,
      Depth,
      Table
    } = idexDiamond
    let price = idexDiamond['Total Price']
    let Fluorescence = idexDiamond['Fluorescence Intensity']
    let filtered = rareCaretDiamonds.filter(rd => rd.cut === cut &&
      rd.Carat === +Carat &&
      rd.Price > Math.round(+price) &&
      rd.Clarity === Clarity &&
      rd.Color === Color && 
      rd.Polish === Polish &&
      rd.Symmetry === Symmetry &&
      rd.Fluorescence === Fluorescence &&
      rd.Table === Table &&
      Math.round(+rd.Depth) === Math.round(+Depth) 
    )
    if(filtered.length > 0)
      cheaperThanRareCaret.push(filtered)
  })
  return Promise.resolve(cheaperThanRareCaret.reduce((a, b) => [...a, ...b]))

}
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
        .map(obj => obj.Data.diamonds)
        .reduce((a, b) => [...a, ...b])
    })
    .then(rareCaretDiamonds => dispatch(diamondsAddedRareCaret(rareCaretDiamonds)))
    .then(() => dispatch(caratChanged()))
    .then(start)
    .catch(console.log)


}
const syncReduxWithMongooseData = () => {
  console.log('called')
  return mongoose.model('caret').getMain()
    .then(res => dispatch(caratChanged(+res.caret)))
}

initializeDatabase()
.then(syncReduxWithMongooseData)
.then(start)
.then(console.log)
.catch(console.log)



// getAllDiamondsFromRareCaret()
// .then(results => {

// .then(rareCaretDiamonds => dispatch(diamondsAddedRareCaret(rareCaretDiamonds)))
// .then(openIdexJsonFile)
// .then(idexDiamonds => dispatch(diamondsAddedIdex(idexDiamonds)))
// .then(findDiamondsCheaperThanRareCaret)
// .then(final => console.log(final.length))


