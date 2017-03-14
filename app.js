
import {
  postUserQuery,
  fetchResultsForQuery,
  retryRequest
} from './helpers'
import {
  writeHeadersToCsv,
  openIdexJsonFile,
  writeResultsToCsv,
  isValid
} from './utils'
import {
  diamondsAddedRareCaret,
  diamondsAddedIdex,
  newUserQuery
} from './actionCreators'
import { store } from './store'

const {getState, dispatch} = store

const startScraping = () => {
  console.log('starting to scrape')
  const {idexDiamonds} = getState()
  Promise.map(idexDiamonds, diamond => {
    return postUserQuery(idexDiamonds[0])
    .then(key => dispatch(newUserQuery(key)))
  })
}

const listenForStoreUpdates = () => {
  console.log('listening for store updates')
  return Promise.resolve(store.subscribe(() => {
    let {lastAction} = getState()
    switch(lastAction.type) {
      case 'NEW_USER_QUERY':
        return fetchResultsForQuery(lastAction.payload)
        .then(results => {
          let tryAgain = []
          let resultsWithDiamonds = []
          results.forEach(result => {
            if(result !== undefined && result.Success === true && result.Data !== null) {
              if(result.Data.counts > 0) {
                resultsWithDiamonds.push(result)
              }
            }
            else if(result.Success === false) {
              tryAgain.push(result)
            }
          })
          if(resultsWithDiamonds.length > 0) {
            return dispatch(diamondsAddedRareCaret(resultsWithDiamonds))
          }
        })
      case 'DIAMONDS_ADDED_RARECARET':
        console.log('found rare caret diamonds', action.payload.length)
      default:
        return null
    }
  }))
}


// const startIdexPromiseChain = (idexDiamond) => {
//   console.log('called')
//   let urlsRetried = []
//   let worked = []
//   let workedWithDiamonds = []
//   let tryAgain = []
//   return postUserQuery(idexDiamond)
//     .then(fetchResultsForQuery)
//     .then(initialResults => {

//     })
    // .then(rareCaratDiamonds => {
    //   console.log('found rare caret diamonds', rareCaratDiamonds.length)
    //   return Promise.all(Promise.map(rareCaratDiamonds, rareCaratDiamond => {
    //     let {Carat} = rareCaratDiamond
    //     return Promise.resolve(rareCaratDiamond)
    //   }))
    //   .then((rareCaretDiamonds) => console.log('rare caret diamonds that match idex diamond', rareCaretDiamonds.length))
    // })
    // .catch(console.log)
// }

const testIdexDiamond = { 'Item ID #': '90361590',
  'Supplier Stock Ref': '498212',
  Cut: 'Round',
  Carat: '0.3',
  Color: 'D',
  'Natural Fancy Color': '',
  'Natural Fancy Color Intensity': '',
  'Natural Fancy Color Overtone': '',
  'Treated Color': '',
  Clarity: 'SI2',
  'Make (Cut Grade)': 'Excellent',
  'Grading Lab': 'GIA',
  'Certificate Number': '2141241921',
  'Certificate Path': 'http://DiamondTransactions.net/icp?di=90361590',
  'Image Path': '',
  'Online Report': '',
  'Price Per Carat': '1235',
  'Total Price': '370.50',
  Polish: 'Very Good',
  Symmetry: 'Very Good',
  'Measurements (LengthxWidthxHeight)': '4.42x4.44x2.58',
  Depth: '58.3',
  Table: '61',
  'Crown Height': '12.5',
  'Pavilion Depth': '43',
  'Girdle (From / To)': 'Medium',
  'Culet Size': 'None',
  'Culet Condition': '',
  Graining: '',
  'Fluorescence Intensity': 'None',
  'Fluorescence Color': '',
  Enhancement: '',
  Supplier: 'Windiam',
  Country: 'Belgium',
  'State / Region': '',
  Remarks: '',
  Phone: '32-3-2266444',
  'Pair Stock Ref.': '',
  Email: 'katrien@windiam.net' }
const syncIdexDiamondsWithStore = () => {
  return openIdexJsonFile()
  .filter(idexDiamond => isValid(idexDiamond) === true)
  .then(idexDiamonds => dispatch(diamondsAddedIdex(idexDiamonds)))
}

listenForStoreUpdates()
.then(syncIdexDiamondsWithStore)
.then(startScraping)
.then(console.log)








