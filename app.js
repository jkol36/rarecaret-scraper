import {initializeDatabase, endCarat} from './config'
import { expect } from 'chai'
import {
  getDiamondsFromRareCaret,
  postUserQuery,
  fetchResultsForQuery
} from './helpers'

import {
  diamondsAddedRareCaret,
  diamondsAddedIdex,
  diamondMatch,
  countChanged,
  initialRareCaretDiamonds,
  initialIdexDiamonds,
  initialDiamondMatches
} from './actionCreators'

import {
  store
} from './store'
import {
  convertToCsv,
  writeHeadersToCsv,
  isValid,
  convertCsvToJson,
  openIdexJsonFile,
  writeResultsToCsv,
  buildFilter,
  createCsvFileWriter,
  removeFile
} from './utils'

import mongoose from 'mongoose'


const {getState, dispatch} = store
const resultFileName = 'results'
const writer = createCsvFileWriter(resultFileName)
const headersForCsv = ['idex id', 'idex price', 'rare caret price', 'price variance', 'count', 'cheaper rare caret diamond', 'idex diamond']


const start = () => {
  let {idexDiamonds, cheapestForIdex, count} = getState()
  console.log(`idex diamonds ${idexDiamonds.length}, current count ${count}`)
  if(count >= idexDiamonds.length) {
    console.log('finished fetching all diamonds from rarecaret')
    return Promise.resolve('done')
  }
  const idexDiamond = idexDiamonds[count]
  const filter = buildFilter(idexDiamond)
  return postUserQuery(filter)
          .then(fetchResultsForQuery)
          .then(results => {
            let final = []
            results.forEach(result => {
              try {
                final.push(result.Data.diamonds)
              }
              catch(err) {

              }
            })
            return final
          })
          .reduce((a, b) => [...a, ...b])
          .then(result => {
            let cheapestRareCaretDiamond = result.sort((a, b) => +a.Price - +b.Price)[0]
            let idexPrice = idexDiamond['Total Price']
            let rareCaretPrice = cheapestRareCaretDiamond.Price
            let priceVariance = Math.round(+idexPrice) / Math.round(+rareCaretPrice)
            console.log(`found cheapest rare caret diamond price: ${cheapestRareCaretDiamond.price}`)
            console.log(`idex price was ${idexPrice}`)
            return writeResultsToCsv([
              idexDiamond['Item ID #'],
              idexPrice, 
              rareCaretPrice, 
              priceVariance,
              count,
              JSON.stringify(cheapestRareCaretDiamond), 
              JSON.stringify(idexDiamond)
            ], writer)
          })
          .then(() => dispatch(countChanged()))
          .then(start)
          .catch(err => {
            dispatch(countChanged())
            start()
          })

}

const syncReduxWithMongooseData = () => {
  console.log('called')
  return Promise.all([
    mongoose.model('count').getMain().then(res => dispatch(countChanged(res.count))),
    mongoose.model('idexDiamond').find({}).then(res => dispatch(initialIdexDiamonds(res))),

  ])
}

const deleteMongoCollections = () => {
  return Promise.all([
    mongoose.model('count').remove({}),
    mongoose.model('idexDiamond').remove({}),
  ])
}

//Starts a fresh scrape. Not delete results.csv first.
const startFromScratch = () => {
  console.log('starting from scratch')
  return initializeDatabase()
  .then(() => removeFile(`${resultFileName}.csv`))
  .then(() => writeHeadersToCsv(headersForCsv, writer))
  .then(deleteMongoCollections)
  .then(syncReduxWithMongooseData)
  .then(() => openIdexJsonFile('idex_diamonds'))
  .then(idexDiamonds => dispatch(diamondsAddedIdex(idexDiamonds)))
  .then(start)
  .catch(console.log)
}



startFromScratch()



