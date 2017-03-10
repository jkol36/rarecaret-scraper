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


export const caratChanged = (carat) => dispatch => {
  return new Promise(resolve => {
    mongoose.model('carat')
      .increment(caratIncrement)
      .then(res => {
        console.log(res)
        dispatch({
        type: C.CARAT_CHANGED,
        carat: res.carat
        })
        resolve(res.carat)
      })
  })
}