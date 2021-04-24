import boardReducer from './board'
import undoable from './undoable'
import { combineReducers } from 'redux'

const allReducers = combineReducers({
    board: undoable(boardReducer),
})

export default allReducers
