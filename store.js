import {
  createStore,
  combineReducers,
  applyMiddleware
} from 'redux'
import thunk from 'redux-thunk'
import {
  rareCaretDiamonds,
  carat
} from './reducers'

export const store = createStore(combineReducers({
  rareCaretDiamonds,
  carat
}), applyMiddleware(thunk));