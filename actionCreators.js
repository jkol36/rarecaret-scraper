import * as C from './constants'
import { caratIncrement } from './config'
import mongoose from 'mongoose'


export const diamondsAddedRareCaret = (diamonds, carat) => dispatch => {
  return new Promise(resolve => {
    let promises = Promise.map(diamonds, diamond => {
      return mongoose
              .model('rareCaratDiamond')
              .create(Object.assign({}, diamond, {requestCarat:carat}))
              .then(res => res.save())
              .catch(err => err)
    })
    Promise.all(promises).then(() => {
        dispatch({
        type: C.DIAMONDS_ADDED_RARECARET,
        diamonds
      })
      resolve(diamonds)
    })
    
  })

}

export const initialDiamondMatches = matchCollection => dispatch => {
  return new Promise(resolve => {
    let matches = []
    matchCollection.forEach(match => matches.push(match._doc))
    dispatch({
      type: C.INITIAL_DIAMOND_MATCHES,
      matches
    })
    resolve()
  })
}
export const diamondsAddedIdex = (diamonds) => dispatch => {
  console.log(`diamonds added idex ${diamonds.length}`)
  return new Promise(resolve => {
    let promises = Promise.map(diamonds, diamond => {
      return mongoose
              .model('idexDiamond')
              .create(diamond)
              .then(res => res.save())
              .catch(err => err)
    })
    Promise.all(promises).then(() => {
        dispatch({
        type: C.DIAMONDS_ADDED_IDEX,
        diamonds
      })
      resolve(diamonds)
    })
    
  })

}

export const initialRareCaretDiamonds = (diamondCollection) => dispatch => {
 return new Promise(resolve => {
    let diamonds = []
    diamondCollection.forEach(diamond => diamonds.push(diamond._doc))
    dispatch({
      type: C.INITIAL_DIAMONDS_RARECARET,
      diamonds
    })
    resolve()
  })
}
export const initialIdexDiamonds = (diamondCollection) => dispatch => {
  return new Promise(resolve => {
    let diamonds = []
    diamondCollection.forEach(diamond => diamonds.push(diamond._doc))
    dispatch({
      type: C.INITIAL_DIAMONDS_IDEX,
      diamonds
    })
    resolve()
  })
}




export const diamondMatch = (idex, rarecaret) => dispatch => {
  return mongoose.model('diamondMatches').create({
    rareCaretDiamondUID: rarecaret.UID,
    idexDiamondId: idex['Item ID #']
  }).then(res => res.save())
  .then(() => {
    dispatch({
      type: C.NEW_MATCH,
      rarecaret,
      idex
    })
  })
  .catch(err => err)
}



export const countChanged = (count) => dispatch => {
  return new Promise(resolve => {
    mongoose.model('count')
      .increment()
      .then(res => {
        console.log(`count changed - new count:${count}`)
        dispatch({
        type: C.COUNT_CHANGED,
        count: res.count
        })
        resolve(res.count)
      })
  })
}