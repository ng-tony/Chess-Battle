import boardReducer from './board'
import history from './undoable'
import { combineReducers } from 'redux'
import gameInfoReducer from './gameInfo'


const allReducers = combineReducers({
    board: history(boardReducer),
    gameInfo: gameInfoReducer,
})

export default allReducers
