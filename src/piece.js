export default class Piece {
    constructor(letters){
        this.color = letters[0] === "w" ? "White" :
                     letters[0] === "b" ? "Black" : null;
        this.piece = getPiece(letters).type;
        this.letters = letters;
    }
};


function getPiece(letters){
    switch (letters[1]) {
        case 'b':
            return BISHOP;
        case 'k':
            return KING;
        case 'n':
            return KNIGHT;
        case 'p':
                return PAWN;
        case 'q':
            return QUEEN;
        case 'r':
            return ROOK;
        default:
            return [];
    }
}

export function getMoves(loc, squares){

}

export function validateMove(from, to, squares){
    console.log( getPiece(squares[from].letters).getMoves(from, squares));
    return getPiece(squares[from].letters).getMoves(from, squares).includes(to)
}

function filterMoves(potential_moves, loc, squares){
    return potential_moves.filter((a) => {
        return (a >= 0 && a <= 63 &&
            (squares[a] === null || squares[a].color !== squares[loc].color))
    });
}

const PAWN = {
    type: 'Pawn',
    getMoves: (loc, squares) => { //Needs validation
        let potential_moves = [];
        let op = squares[loc].color === 'White' ? 
            (b) => loc + b :
            (b) => loc - b;
        //Normal Move
        potential_moves.push(op(8));

        //Double Move 
        if ((Math.floor(loc/8) === 1 && squares[loc].color === 'White') ||
            (Math.floor(loc/8) === 6 && squares[loc].color === 'Black')){
            potential_moves.push(op(16));
        }
        const moves = filterMoves(potential_moves, loc, squares);
        //Capture
        if (squares[op(7)] && squares[op(7)].color !== squares[loc].color){
            moves.push(op(7));
        }
        if (squares[op(9)] && squares[op(9)].color !== squares[loc].color){
            moves.push(op(9));
        }
        return moves;
    }
}
//Need to check if King is walking into check
const KING = {
    type: 'King',
    getMoves: (loc, squares) => {
        let potential_moves = [-9, -8, -7, -1, 1, 7, 8, 9].map((a) => a+loc);
        return filterMoves(potential_moves, loc, squares);
    }
}

const BISHOP = {
    type: 'Bishop',
    getMoves: (loc, squares) => {
        let potential_moves = [];
        const operations = [(i) => loc+i*9, (i) => loc+i*-9,
            (i) => loc+i*7, (i) => loc+i*-7];
        for (let op of operations){
            for (let i = 1; i < 9; i++){
                potential_moves.push(op(i));
                if (squares[op(i)]){
                    potential_moves.push(op(i));
                    break;
                }
            }
        }
        return filterMoves(potential_moves, loc, squares);
    }
}

const ROOK = {
    type: 'Rook',
    getMoves: (loc, squares) => {
        let potential_moves = [];
        const operations = [(i) => loc+i*8, (i) => loc+i*-8,
            (i) => loc+i*1, (i) => loc+i*-1];
        for (let op of operations){
            for (let i = 1; i < 9; i++){
                potential_moves.push(op(i));
                if (squares[op(i)]){
                    potential_moves.push(op(i));
                    break;
                }
            }
        }
        return filterMoves(potential_moves, loc, squares);
    }
}

const QUEEN = {
    type: 'Queen',
    getMoves: (loc, squares) => {
        let potential_moves = [];
        const operations = [(i) => loc+i*9, (i) => loc+i*-9,
            (i) => loc+i*7, (i) => loc+i*-7,
            (i) => loc+i*8, (i) => loc+i*-8,
            (i) => loc+i*1, (i) => loc+i*-1];
        for (const op of operations){
            for (let i = 1; i < 9; i++){
                potential_moves.push(op(i));
                if (squares[op(i)]){
                    potential_moves.push(op(i));
                    break;
                }
            }
        }
        console.log(potential_moves)
        return filterMoves(potential_moves, loc, squares);
    }
}

const KNIGHT = {
    type: 'Knight',
    getMoves: (loc, squares) => {
        let potential_moves = [10, 17, 6, 15, -10, -17, -6, -15].map(
            (a) => parseInt(a)+parseInt(loc));
        console.log(potential_moves)
        return filterMoves(potential_moves, loc, squares);
    }
}
