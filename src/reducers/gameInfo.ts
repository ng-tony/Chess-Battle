import produce from 'immer'
import { SquareData } from '../components/BuildingBlocks/Square';

export interface gameInfo {
    selectedSquare: SquareData,
    lastMove: {from:number, to:number},
    flippedBoard: boolean,
    hideEditor: boolean,
    about: boolean,
}

const defaultState = {
    selectedSquare: {id:-1, highlighted:false, selected:false, lastMove:false} as SquareData,
    flippedBoard: false,
    hideEditor: false,
    squaresSelected: [],
    about: false,
    lastMove: {from: -1, to: -1}
} as gameInfo
const gameInfoReducer = (state = defaultState, action: any) => {
    return produce(state, (draftState) => {
        switch (action.type) {
            case 'FLIP_BOARD':
                draftState.flippedBoard = !draftState.flippedBoard;
                break
            case 'SELECT_SQUARE':
                draftState.selectedSquare = action.selectedSquare;
                break;
            case 'TOGGLE_EDITOR':
                draftState.hideEditor = !draftState.hideEditor;
                break;
            case 'MOVE_PIECE':
                draftState.lastMove = {from:action.from, to:action.to,}
                break;
            case 'TOGGLE_ABOUT':
                draftState.about = !draftState.about;
                break;
            default:
                return
        }
    })
}

export default gameInfoReducer
