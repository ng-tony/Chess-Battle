import boardReducer from './board'
import undoable from './undoable'
import { combineReducers } from 'redux'
import gameInfoReducer from './gameInfo'


const allReducers = combineReducers({
    board: undoable(boardReducer),
    gameInfo: gameInfoReducer,
})

export default allReducers
