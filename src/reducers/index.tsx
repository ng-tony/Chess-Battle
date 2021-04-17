import boardReducer from './board'
import { combineReducers } from 'redux'

const allReducers = combineReducers({
    board: boardReducer,
})

export default allReducers
