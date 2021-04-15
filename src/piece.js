export default class Piece {
    constructor(letters){
        this.color = letters[0] === "w" ? "White" :
                     letters[0] === "b" ? "Black" : null;
        this.letters = letters;
    }
};


const getPiece = (letters) => {
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

export const getMoves = (loc, squares) => {

}

export const validateMove = (from, to, squares) => {
    return getPiece(squares[from].letters).getMoves(from, squares).includes(to);
}

//Stupid pawns agh
const getChecks = (squares, color) => {
    //Might be interesting to find which squares got checked
    return squares.reduce((acc, square, i) => {
        if(square){
            let piece = getPiece(square.letters);
            let moves = [];
            
            if (!piece || getColor(squares[i]) === color) return acc;
            if (piece === PAWN || piece === KING){    
                moves = piece.getAttackMoves(i, squares)
                console.log(moves)
            } else {
                moves = piece.getMoves(i, squares)
            }
            return acc.concat(
                moves.filter((move) => {
                    return !squares[move] ? false : 
                        getPiece(squares[move].letters) === KING &&
                        getColor(squares[move]) !== getColor(squares[i]);
            }))
        } else {
            return [...new Set(acc)];
        }
    }, [])
}

const filterMoves = (potential_moves, loc, squares) => {
    return potential_moves.filter((a) => {
        return (a >= 0 && a <= 63 &&
            (squares[a] === null || getColor(squares[a]) !== getColor(squares[loc])))
    });
}

const getColor = (square) => {
    return square.letters[0] === "w" ? "White" :
        square.letters[0] === "b" ? "Black" : null;
}

const PAWN = {
    type: 'Pawn',
    getMoves: (loc, squares) => { 
        let potential_moves = [];
        let op = getColor(squares[loc]) === 'White' ? 
            (b) => loc + b :
            (b) => loc - b;
        //Normal Move
        potential_moves.push(op(8));

        //Double Move 
        if ((Math.floor(loc/8) === 1 && getColor(squares[loc]) === 'White') ||
            (Math.floor(loc/8) === 6 && getColor(squares[loc]) === 'Black')){
            potential_moves.push(op(16));
        }
        const moves = filterMoves(potential_moves, loc, squares);
        return moves.concat(PAWN.getAttackMoves(loc, squares));
    },
    getAttackMoves: (loc, squares) => {
        let moves = [];
        let op = getColor(squares[loc]) === 'White' ? 
            (b) => loc + b :
            (b) => loc - b;
        if (squares[op(7)] && getColor(squares[op(7)]) !== getColor(squares[loc])){
            moves.push(op(7));
        }
        if (squares[op(9)] && getColor(squares[op(9)]) !== getColor(squares[loc])){
            moves.push(op(9));
        }
        return moves;
    },
}
//Need to check if King is walking into check
const KING = {
    type: 'King',
    getMoves: (loc, squares) => {
        let potential_moves = [-9, -8, -7, -1, 1, 7, 8, 9].map((a) => a+loc);
        //return filterMoves(potential_moves, loc, squares);
        return filterMoves(potential_moves, loc, squares).filter((move) => {
            let new_squares = [...squares];
            new_squares[move] = new_squares[loc];
            new_squares[loc] = null;
            // console.log(loc, move)
            // console.log(getChecks(new_squares))
            return !getChecks(new_squares, getColor(new_squares[move])).length;
        });
    },
    getAttackMoves: (loc, squares) => {
        return filterMoves([-9, -8, -7, -1, 1, 7, 8, 9].map((a) => a+loc), loc, squares)
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
        return filterMoves(potential_moves, loc, squares);
    }
}

const KNIGHT = {
    type: 'Knight',
    getMoves: (loc, squares) => {
        let potential_moves = [10, 17, 6, 15, -10, -17, -6, -15].map(
            (a) => parseInt(a)+parseInt(loc));
        return filterMoves(potential_moves, loc, squares);
    }
}
