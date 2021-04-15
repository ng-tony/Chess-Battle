import Piece from '../piece'
const startPosition = [
    new Piece('wr'), new Piece('wn'), new Piece('wb'), new Piece('wq'), new Piece('wk'), new Piece('wb'), new Piece('wn'), new Piece('wr'),
    new Piece('wp'), new Piece('wp'), new Piece('wp'), new Piece('wp'), new Piece('wp'), new Piece('wp'), new Piece('wp'), new Piece('wp'),
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    new Piece('bp'), new Piece('bp'), new Piece('bp'), new Piece('bp'), new Piece('bp'), new Piece('bp'), new Piece('bp'), new Piece('bp'),
    new Piece('br'), new Piece('bn'), new Piece('bb'), new Piece('bq'), new Piece('bk'), new Piece('bb'), new Piece('bn'), new Piece('br'),
]

const boardReducer = (state = startPosition, action) => {
    const newState = [...state];
    switch(action.type){
        case 'EDIT':
            newState[action.loc] = action.val;
            break;
        case 'MOVE_PIECE':
            newState[action.to] = newState[action.from]
            newState[action.from] = null;
            break;
        default:
            return state;
        
    };
    return newState;
};
export default boardReducer;