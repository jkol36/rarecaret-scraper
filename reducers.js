import {
  DIAMONDS_ADDED_RARECARET, 
  DIAMONDS_ADDED_IDEX,
  NEW_USER_QUERY
} from './constants'
import createReducer  from 'redux-action-reducer'


export const rareCaretDiamonds = createReducer(
  [DIAMONDS_ADDED_RARECARET, (state, payload) => [...state, ...payload]]
  )([])

export const idexDiamonds = createReducer(
  [DIAMONDS_ADDED_IDEX, (state, payload) => state.concat(payload)]
  )([])

export const userQueries = createReducer(NEW_USER_QUERY)('')

export const lastAction = (state=null, action) => {
  return action
}
