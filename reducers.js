import * as C from './constants'

export const idexDiamonds = (state=[], action) => {
  switch(action.type) {
    case C.DIAMONDS_ADDED_IDEX:
      return action.diamonds
    default:
      return state
  }
}

export const rareCaretDiamonds = (state=[], action) => {
  switch(action.type) {
    case C.DIAMONDS_ADDED_RARECARET:
      return action.diamonds
    default:
      return state
  }
}

export const carat = (state=0.15, action) => {
  switch(action.type) {
    case C.CARAT_CHANGED:
      return action.carat
    default:
      return state
  }
}