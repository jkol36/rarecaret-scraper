import {
  createStore,
  combineReducers,
  applyMiddleware
} from 'redux'
import thunk from 'redux-thunk'
import {
  rareCaretDiamonds,
  idexDiamonds,
  count,
  diamondMatches
} from './reducers'

export const store = createStore(combineReducers({
  rareCaretDiamonds,
  idexDiamonds,
  count,
  diamondMatches
}), applyMiddleware(thunk));