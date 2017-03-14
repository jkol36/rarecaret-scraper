import {
  createStore,
  combineReducers,
  applyMiddleware
} from 'redux'
import thunk from 'redux-thunk'
import {
  rareCaretDiamonds,
  idexDiamonds,
  lastAction,
  userQueries
} from './reducers'

export const store = createStore(combineReducers({
  rareCaretDiamonds,
  idexDiamonds,
  lastAction,
  userQueries
}), applyMiddleware(thunk));