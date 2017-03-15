import * as C from './constants'


export const rareCaretDiamonds = (state=[], action) => {
  switch(action.type) {
    case C.DIAMONDS_ADDED_RARECARET:
      return action.diamonds
    default:
      return state
  }
}
export const idexDiamonds = (state=[], action) => {
  switch(action.type) {
    case C.DIAMONDS_ADDED_IDEX:
      return action.diamonds
    default:
      return state
  }
}

export const diamondMatches = (state = [], action) => {
  switch(action.type) {
    case C.NEW_MATCH:
      return [...action.rarecaret, ...action.idex]
    default:
      return state
  }
}


export const count = (state=0, action) => {
  switch(action.type) {
    case C.COUNT_CHANGED:
      return action.count
    default:
      return state
  }
}