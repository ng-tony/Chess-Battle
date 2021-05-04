import { decodePiece, PieceType, moveSucessResults, pieceToLetter, indexToCoord} from '../GameLogic'
import produce from 'immer'

export const decodeActionForDisplay = (state:any, action:any):string => {
    switch (action.type) {
        case 'EDIT':
            return "e:" + pieceToLetter(action.val) + indexToCoord(action.loc)
        case 'MOVE_PIECE':
            return pieceToLetter(state[action.from])+ indexToCoord(action.to)
        case 'ADD_POWERUP':
            return "pow"
        case 'REMOVE_POWERUPS':
            return "pow"
        default:
            return ""
    }
}

const defaultState = [
    decodePiece('wr'), decodePiece('wn'), decodePiece('wb'),  decodePiece('wk'), decodePiece('wq'), decodePiece('wb'), decodePiece('wn'), decodePiece('wr'),
    decodePiece('wp'), decodePiece('wp'), decodePiece('wp'), decodePiece('wp'), decodePiece('wp'), decodePiece('wp'), decodePiece('wp'), decodePiece('wp'),
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    decodePiece('bp'), decodePiece('bp'), decodePiece('bp'), decodePiece('bp'), decodePiece('bp'), decodePiece('bp'), decodePiece('bp'), decodePiece('bp'),
    decodePiece('br'), decodePiece('bn'), decodePiece('bb'), decodePiece('bk'), decodePiece('bq'), decodePiece('bb'), decodePiece('bn'), decodePiece('br'),
    ]

const boardReducer = (state = defaultState, action: any) => {
    return produce(state, (draftState) => {
        switch (action.type) {
            case 'EDIT':
                if (action.val.type === PieceType.Blank){
                    draftState[action.loc] = null;
                } else {
                    draftState[action.loc] = action.val
                }
                break;
            case 'MOVE_PIECE':
                draftState = moveSucessResults(action.from, action.to, draftState);
                break;
            case 'ADD_POWERUP':
                if (draftState[action.loc] && !state[action.loc]?.powerUps.reduce((acc, pup) => {
                    return acc || pup.type === action.powerUp.type;
                }, false)) {
                    draftState[action.loc]!.powerUps.push(action.powerUp);
                }
                break;
            case 'REMOVE_POWERUPS':
                if (draftState[action.loc] && draftState[action.loc]?.powerUps !== []) {
                    draftState[action.loc]!.powerUps = [];
                }
                break;
            default:
                return
        }
    })
}

export default boardReducer
