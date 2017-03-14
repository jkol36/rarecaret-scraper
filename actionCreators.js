import * as C from './constants'
import { caratIncrement } from './config'
import mongoose from 'mongoose'


export const diamondsAddedRareCaret = (diamonds) => dispatch => {
  dispatch({
    type:C.DIAMONDS_ADDED_RARECARET,
    payload: diamonds
  })
  return Promise.resolve()
}
export const diamondsAddedIdex = (diamonds) => dispatch => {
  return Promise.all(Promise.map(diamonds, diamond => {
      dispatch({
      type: C.DIAMONDS_ADDED_IDEX,
      payload: diamond
    })
    return Promise.resolve()
  }))
}
export const newUserQuery = (key) => dispatch => {
  return Promise.resolve(dispatch({
    type: C.NEW_USER_QUERY,
    payload: key
  }))
}
// export const diamondsAddedRareCaret = (diamonds) => dispatch => {
//   return new Promise(resolve => {
//     let promises = Promise.map(diamonds, diamond => {
//       return mongoose
//               .model('rareCaratDiamond')
//               .create(Object.assign({}, diamond, {requestCarat:carat}))
//               .then(res => res.save())
//               .catch(err => err)
//     })
//     Promise.all(promises).then(() => {
//         dispatch({
//         type: C.DIAMONDS_ADDED_RARECARET,
//         diamonds
//       })
//       resolve(diamonds)
//     })
    
//   })

// }
// export const diamondsAddedIdex = (diamonds) => dispatch => {
//   return new Promise(resolve => {
//     let promises = Promise.map(diamonds, diamond => {
//       return mongoose
//               .model('idexDiamond')
//               .create(diamond)
//               .then(res => res.save())
//               .catch(err => err)
//     })
//     Promise.all(promises).then(() => {
//         dispatch({
//         type: C.DIAMONDS_ADDED_RARECARET,
//         diamonds
//       })
//       resolve(diamonds)
//     })
    
//   })

// }



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