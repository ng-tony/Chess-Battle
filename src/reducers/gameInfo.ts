import produce from 'immer'

interface gameInfo {
    selectedSquare: number,
    flippedBoard: boolean,
    hideEditor: boolean,
}

const defaultState = {
    selectedSquare: -1,
    flippedBoard: false,
    hideEditor: false,
    squaresSelected: [],
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
                    draftState.hideEditor = ! draftState.hideEditor;
                break;
            default:
                return
        }
    })
}

export default gameInfoReducer
