import { decodePiece, PieceType} from '../GameLogic'
import produce from 'immer'


const defaultState = [
    decodePiece('wr'), decodePiece('wn'), decodePiece('wb'), decodePiece('wq'), decodePiece('wk'), decodePiece('wb'), decodePiece('wn'), decodePiece('wr'),
    decodePiece('wp'), decodePiece('wp'), decodePiece('wp'), decodePiece('wp'), decodePiece('wp'), decodePiece('wp'), decodePiece('wp'), decodePiece('wp'),
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    decodePiece('bp'), decodePiece('bp'), decodePiece('bp'), decodePiece('bp'), decodePiece('bp'), decodePiece('bp'), decodePiece('bp'), decodePiece('bp'),
    decodePiece('br'), decodePiece('bn'), decodePiece('bb'), decodePiece('bq'), decodePiece('bk'), decodePiece('bb'), decodePiece('bn'), decodePiece('br'),
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
                break
            case 'MOVE_PIECE':
                draftState[action.to] = draftState[action.from]
                draftState[action.from] = null
                if (draftState[action.to]) {
                    draftState[action.to]!.haveMoved = true
                }
                break
            case 'ADD_POWERUP':
                if (draftState[action.loc]) {
                    draftState[action.loc]!.powerUps.push(action.powerUp);
                }
                break  
            default:
                return
        }
    })
}

export default boardReducer
