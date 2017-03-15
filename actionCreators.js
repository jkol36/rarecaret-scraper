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

export const diamondsAddedIdex = (diamonds) => dispatch => {
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

export const diamondMatch = (idex, rarecaret) => dispatch => {
  return mongoose.model('diamondMatches').create({
    rareCaretDiamondUID: rarecaret.UID,
    idexDiamondId: idex['Item ID']
  }).then(res => res.save())
  .then(() => {
    dispatch({
      type: C.DIAMOND_MATCH,
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
        console.log(res)
        dispatch({
        type: C.COUNT_CHANGED,
        count: res.count
        })
        resolve(res.count)
      })
  })
}