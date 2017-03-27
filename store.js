import {
  createStore,
  combineReducers,
  applyMiddleware
} from 'redux'
import thunk from 'redux-thunk'
import {
  rareCaretDiamonds,
  idexDiamonds,
  diamondMatches,
  count
} from './reducers'

export const store = createStore(combineReducers({
  rareCaretDiamonds,
  idexDiamonds,
  diamondMatches,
  count
}), applyMiddleware(thunk));