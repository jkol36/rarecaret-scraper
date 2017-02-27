import {
  createStore,
  combineReducers,
  applyMiddleware
} from 'redux'
import thunk from 'redux-thunk'
import {
  rareCaretDiamonds,
  idexDiamonds,
  carat
} from './reducers'

export const store = createStore(combineReducers({
  rareCaretDiamonds,
  idexDiamonds,
  carat
}), applyMiddleware(thunk));