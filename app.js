

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
  countChanged
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
  buildFilter
} from './utils'

import mongoose from 'mongoose'


const {getState, dispatch} = store


const start = () => {
  let {idexDiamonds, rareCaretDiamonds, count, diamondMatches} = getState()
  console.log(`rare caret length ${rareCaretDiamonds.length}, diamond matches ${diamondMatches.length} idex diamond length ${idexDiamonds.length}, current count ${count}`)
  if(count >= idexDiamonds.length) {
    console.log('finished fetching all diamonds from rarecaret')
    console.log(rareCaretDiamonds.length)
    return Promise.resolve('done')
  }
  const idexDiamond = idexDiamonds[count]
  const filter = buildFilter(idexDiamond)
  return postUserQuery(filter)
          .delay(2000)
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
          .reduce((a,b) => [...a, ...b])
          .map(rareCaretDiamond => dispatch(diamondMatch(idexDiamond, rareCaretDiamond)))
          .then(() => dispatch(countChanged()))
          .then(start)
          .catch(console.log)

}
const oldStart = () => {
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
.then(() => openIdexJsonFile('new-idex'))
.then(idexDiamonds => dispatch(diamondsAddedIdex(idexDiamonds)))
.then(start)

//.reduce((a, b) => [...a, ...b])
//.then(rareCaretDiamonds => {
  //console.log('found rare caret diamonds', rareCaretDiamonds.length)
//})
// .map(buildFilter)
// .map(postUserQuery)
// .map(fetchResultsForQuery)

// initializeDatabase()
// .then(syncReduxWithMongooseData)
// .then(start)


