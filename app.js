import _ from 'underscore'
import deepEqual from 'deep-equal'
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
  removeFile,
  eliminateDuplicates
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


//each idex diamond returned will have a unique set of properties.
//the idea diamond has 7 properties, 
//their needs to be a variation between those properties, 
//so the fail count represents that variation. 
//If I have a fail count of 6 then that means there was a variation of +1 between one of the varaibles
const getUniqueIdex = () => {
  return openIdexJsonFile('idex_diamonds')
  .then(diamonds => {
    let headers = Object.keys(diamonds[0])
    let uniqueIdexWriter = createCsvFileWriter('uniqueIdex')
    writeHeadersToCsv(headers, uniqueIdexWriter)
    .then(() => {
      let unique = []
      let initialKeys = ['Color', 'Carat', 'Clarity', 'Polish', 'Symmetry']
      let setLookup = {
      'Color': new Set(),
      'Carat': new Set(),
      'Clarity': new Set(),
      'Polish': new Set(),
      'Symmetry': new Set(),
      'Flouresc'
      }
      diamonds.forEach(diamond => {
        let failCount = 0
        initialKeys.forEach(k => {
          if(setLookup[k].has(diamond[k])) {
            failCount += 1
          }
          else {
            setLookup[k].add(diamond[k])
          }
        })
        console.log(setLookup)
        if(failCount !== initialKeys.length) {
          unique.push(diamond)
        }
      })
      return Promise.all(Promise.map(unique, diamond => {
        return writeResultsToCsv(Object.keys(diamond).map(k => diamond[k]), uniqueIdexWriter)
      }))
    })
  })
}

const stringify = obj => {
  let allowableKeys = ['Color', 'Carat', 'Clarity', 'Polish', 'Symmetry', 'Fluorescence Intensity', 'Fluorescence Color']
  return ''.concat(Object.keys(obj).map(k => {
    if(allowableKeys.indexOf(k) !== -1)
      return obj[k]
  }))
}


// const parseForDuplicates = array => { 
//   let final = new Set()
//   array.sort((a, b) => {
//     if(deepEqual(a, b) === false) {
//       if(!final.has(a)) {
//         final.add(a)
//       }
//       if(!final.has(b)) {
//         final.add(b)
//       }
//     }
//   })
//   console.log(final.size)
// }
const testingSomething = () => {
  return openIdexJsonFile('idex_diamonds')
  .then(parseForDuplicates)
}
const getUniqueIdex2 = () => {
  return openIdexJsonFile('idex_diamonds')
  .then(diamonds => {
    let headers = Object.keys(diamonds[0])
    let uniqueIdexWriter = createCsvFileWriter('uniqueIdex')
    writeHeadersToCsv(headers, uniqueIdexWriter)
    .then(() => {
      let uniqueStrings = new Set()
      let unique = new Set()
      diamonds.forEach(diamond => {
        if(!uniqueStrings.has(stringify(diamond)) && !unique.has(diamond)) {
          uniqueStrings.add(stringify(diamond))
          unique.add(diamond)
      }

    })
     return Promise.all(Promise.map(unique, diamond => {
        return writeResultsToCsv(Object.keys(diamond).map(k => diamond[k]), uniqueIdexWriter)
      }))
  })
  })
}

testingSomething()



