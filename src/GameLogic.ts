import produce, {original} from "immer"

const debug = false;
const BOARD_SIZE = 8

export enum Color {
    white = 'White',
    black = 'Black',
}

export enum PieceType {
    Bishop = 'Bishop',
    King = 'King',
    Knight = 'Knight',
    Pawn = 'Pawn',
    Queen = 'Queen',
    Rook = 'Rook',
    Blank = 'Blank',
}

export default interface PieceData {
    color: Color
    type: PieceType
    haveMoved: boolean
    letters: string
    powerUps: PowerUpData[]
}

export enum PowerUpType {
    Guard = "Guard",
    Shield = "Shield",
    Sword = "Sword",
    Flail = "Flail",
    Clear = "Clear"
}

export interface PowerUpData {
    type: PowerUpType,
}

export const decodePiece = (letters: string): PieceData => {
    return {
        color: letters[0] === 'w' ? Color.white : Color.black,
        type: decodePieceType(letters),
        haveMoved: false,
        letters,
        powerUps: [],
    }
}

const decodePieceType = (letters: string): PieceType => {
    switch (letters[1]) {
        case 'b':
            return PieceType.Bishop
        case 'k':
            return PieceType.King
        case 'n':
            return PieceType.Knight
        case 'p':
            return PieceType.Pawn
        case 'q':
            return PieceType.Queen
        case 'r':
            return PieceType.Rook
        default:
            return PieceType.Blank
    }
}

interface PieceMove {
    addend: number,
    rowChange: number,
    recurring: number,
    pawnCapture?: boolean,
    move?: number,
    castling?: boolean,
}

const _getMoves = (
    from:number,
    squares: (PieceData | null)[],
    ):PieceMove[] => {
    //Check
    if(squares[from] === null) return [];

    let moveStratData = moveStrategies.get(squares[from]!.type)
    moveStratData = expandRecurringMoves(from, moveStratData!, squares);
    moveStratData = filterPotentialMoves(from, moveStratData, moveFilters, squares);

    //Moves that leave/cause player to be in check
    return moveStratData.filter((moveStrat) => {
        const move = moveStrat.move!;
        const newSquares = produce(squares, draft => {
            moveSucessResults(from, move, draft)
        });
        if(checkCheck(squares[from]!.color, newSquares)) return false
        return true
    })
}


export const getMoves = (
    from:number,
    squares: (PieceData | null)[],
    ):number[] => {
        return _getMoves(from, squares).map(({move}) => {
            return move!
        });
}

//TODO: not very dry, uses same code as _getmoves but only needs to checkChecks
//on the proposed move which is sorta an expensive action
//refactor sometime
export const validateMove = (
    from:number,
    to: number, 
    squares: (PieceData | null)[],
    ):boolean => {
    if(squares[from] === null) return false;

    let moveStratData = moveStrategies.get(squares[from]!.type)
    moveStratData = expandRecurringMoves(from, moveStratData!, squares);
    moveStratData = filterPotentialMoves(from, moveStratData, moveFilters, squares);
    const newSquares = produce(squares, draft => {
        moveSucessResults(from, to, draft)
    })
    // if (checkCheck(squares[from]!.color, newSquares)) return false;
    const moves = moveStratData.map((moveStratData) => {
        return moveStratData.move
    });
    return moves.includes(to);
} 

const expandRecurringMoves = (
    from:number,
    moveStratData:PieceMove[],
    squares: (PieceData | null)[]): PieceMove[]=>  {
    return moveStratData.map((moveData, i) => {
        let expanded = []
        for (let i = 1; i < moveData.recurring+1; i++){
            expanded.push({
                addend: moveData.addend,
                rowChange: moveData.rowChange*i,
                recurring: 1,
                pawnCapture: moveData.pawnCapture,
                move: moveData.addend*i + from,
                castling: moveData.castling,
            })
            //If move direction is now blocked
            if (squares[moveData.addend*i + from] !== null)
                break;
        }
        return expanded;
    
    }).flat();
}

const filterPotentialMoves = (
    from:number,
    moveStratData:PieceMove[],
    moveFilters:((
        from: number, 
        moveStratData:PieceMove[], 
        squares:(PieceData | null)[])
            => PieceMove[])[],
    squares: (PieceData | null)[]): PieceMove[] => {
        let retv = moveStratData;
        for (let filter of moveFilters){
            retv = filter(from, retv, squares);
        }
        return retv;
}

const checkCheck = (
    color: Color,
    squares: (PieceData | null)[]):boolean => {
        for (let [i, square] of squares.entries()){
            if (square === null || square.color === color) continue;
            let moveStratData = moveStrategies.get(square.type)
            moveStratData = expandRecurringMoves(i, moveStratData!, squares);
            moveStratData = filterPotentialMoves(i ,moveStratData, moveFilters, squares);
            const inCheck =  moveStratData.reduce((acc, curr) => {
                return (acc || (squares[curr.move!]?.type === PieceType.King && 
                        !hasPowerUp(squares[curr.move!], PowerUpType.Shield))) 
            }, false);
            if (inCheck) return true;
        } 
        return false;
}

const removeSameColors = (
    from: number, 
    moveStratData:PieceMove[], 
    squares:(PieceData | null)[]):PieceMove[] =>{
        const color = squares[from]?.color;
        return moveStratData.filter(({move}) => {
            return (move && squares[move]?.color === color) ? 
                    false : true;
        })
}

const removeOutOfBounds = (
    from: number, 
    moveStratData:PieceMove[], 
    squares:(PieceData | null)[]):PieceMove[] =>{
        return moveStratData.filter(({move}) => {
            return !(move! > 63 || move! < 0) 
        })
}

const hasRowWrapped = (from:number, to:number, rowChange:number) =>{
    const prevRow = Math.floor(from/BOARD_SIZE);
    const moveRow = Math.floor(to/BOARD_SIZE);
    return (Math.abs(prevRow - moveRow) !== rowChange)
}

const removeRowWrappedMove = (
    from: number, 
    moveStratData:PieceMove[], 
    squares:(PieceData | null)[]):PieceMove[] =>{
        return moveStratData.filter(({move, rowChange}) => {
            return !hasRowWrapped(from, move!, rowChange)
        })
}

const removeShieldedSquares = (
    from: number, 
    moveStratData:PieceMove[], 
    squares:(PieceData | null)[]):PieceMove[] =>{
        return moveStratData.filter(({move}) => {
            return !hasPowerUp(squares[move!], PowerUpType.Shield);
        })
}

const removePawnInvalidMove = (
    from: number, 
    moveStratData:PieceMove[], 
    squares:(PieceData | null)[]):PieceMove[] => {
        if(squares[from]?.type !== PieceType.Pawn){
            return moveStratData;
        }
        return moveStratData.filter(({move, pawnCapture, rowChange}) => {
            let validMove = true;
            //Backward Movement
            if(squares[from]?.type === PieceType.Pawn) {
                validMove = validMove && squares[from]?.color === Color.white ?
                from < move! : from > move!
            }
            //Valid Capture
            if(pawnCapture) {
                validMove = validMove &&
                    squares[move!]?.color !== squares[from]?.color &&
                    squares[move!] !== null;
            } else {
                validMove = validMove && squares[move!] === null;
            }
            //Valid Double Move
            if(rowChange === 2) {
                validMove = validMove && squares[from]?.haveMoved === false;
            }
            return validMove;
        })
}

const removeInvalidCastles = (
    from: number, 
    moveStratData:PieceMove[],
    squares:(PieceData | null)[]):PieceMove[] => {
        if(squares[from]?.type !== PieceType.King){
            return moveStratData;
        }
        return moveStratData.filter(({addend, move, castling}) => {
            let validMove = true;
            if(castling){
                if(!squares[from]?.haveMoved){
                    
                    let dir = Math.abs(addend)/addend;
                    for (let i = 1; i < 5; i++){
                        const checkedSq = from + i*dir;
                        if(squares[checkedSq] === null) continue
                        if (!(squares[checkedSq]?.type === PieceType.Rook &&
                              squares[checkedSq]?.color === squares[from]?.color &&
                              !squares[checkedSq]?.haveMoved)){
                              validMove = false;
                        }
                        break;
                    }
                } else {
                    validMove = false;
                }
            }
            return validMove;
        })
}

const hasPowerUp = (square: (PieceData | null), pupType:PowerUpType) => {
    return square && square!.powerUps.length > 0 && square?.powerUps.reduce( (acc, powerUp) => {
        return acc || powerUp.type === pupType
    }, false)
}

const getPawnCaptureMoves = (from: number): number[] => {
    return [from + 7, from - 7, from + 9, from - 9];
}

const guardStrategy = (loc: number, squares: (PieceData | null)[], move: number): (PieceData | null)[] => {
    for (const [i, square] of squares.entries()) {
        if (!square || square!.color === squares[move]?.color) continue
        if(hasPowerUp(squares[i], PowerUpType.Guard) &&
            getMoves(i, squares).includes(move) &&
            //It is not (a pawn who's capturable move includes this square)
            !(squares[loc]?.type === PieceType.Pawn && !getPawnCaptureMoves(loc).includes(move))) {
            return moveSucessResults(i, move, squares)
        }
    }
    return squares;
}

const swordStrategy = (loc: number, squares: (PieceData | null)[], move: number): (PieceData | null)[] => {
    if(hasPowerUp(squares[move], PowerUpType.Sword)){
        for (const m of [8, -8].map((a) => a + move)){
            if (squares[m] &&
                squares[m]?.color !== squares[move]?.color &&
                !hasPowerUp(squares[m], PowerUpType.Shield)){
                    squares[m] = null;
            }
        }
        for (const m of [1, -1].map((a) => a + move)){
            if (squares[m] &&
                squares[m]?.color !== squares[move]?.color &&
                !hasPowerUp(squares[m], PowerUpType.Shield) &&
                !hasRowWrapped(move, m, 0)){
                    squares[m] = null;
            }
        }

      
    }
    return squares;
}

const flailStrategy = (loc: number, squares: (PieceData | null)[], move: number): (PieceData | null)[] => {
    if(hasPowerUp(squares[move], PowerUpType.Flail)){
        for (const m of [9, -9, 7, -7].map((a) => a + move)){
            if (squares[m] &&
                squares[m]?.color !== squares[move]?.color  &&
                !hasPowerUp(squares[m], PowerUpType.Shield) && 
                !hasRowWrapped(move, m, 1)){
                    squares[m] = null;
            }
        }
    }
    return squares;
}

const castlingStrategy = (loc: number, squares: (PieceData | null)[], move: number): (PieceData | null)[] => {
    if(squares[move]?.type === PieceType.King && Math.abs(move - loc) === 2){
        const dir = Math.abs(move - loc)/(move - loc);
        const orig = original(squares);
        let i;
        for (i = 1; i < 4; i++){
            if(orig![move + dir*i] !== null) break;
        }
        squares[move - dir] = squares[move + dir*i];
        squares[move + dir*i] = null;
    }
    return squares;
}



export const moveSucessResults = (
    from: number,
    to:number, squares: (PieceData | null)[]
): (PieceData | null)[] => {

    squares[to] = squares[from]
    squares[from] = null
    if (squares[to]) {
        squares[to]!.haveMoved = true
    }
    for (const strat of moveSucessStrategies) {
        squares = strat(from, squares, to);
    }
    return squares;
}

const moveStrategies = new Map<PieceType, PieceMove[]>([
    [PieceType.Bishop, [
        {addend: - 9, rowChange: 1, recurring: BOARD_SIZE},
        {addend: + 9, rowChange: 1, recurring: BOARD_SIZE},
        {addend: + 7, rowChange: 1, recurring: BOARD_SIZE},
        {addend: - 7, rowChange: 1, recurring: BOARD_SIZE}
    ]],
    [PieceType.King, [
        {addend: - 9, rowChange: 1, recurring: 1},
        {addend: - 8, rowChange: 1, recurring: 1},
        {addend: - 7, rowChange: 1, recurring: 1},
        {addend: - 1, rowChange: 0, recurring: 1},
        {addend: + 1, rowChange: 0, recurring: 1},
        {addend: + 7, rowChange: 1, recurring: 1},
        {addend: + 8, rowChange: 1, recurring: 1},
        {addend: + 9, rowChange: 1, recurring: 1},
        {addend: - 2, rowChange: 0, recurring: 1, castling: true},
        {addend: + 2, rowChange: 0, recurring: 1, castling: true},
    ]],
    [PieceType.Knight, [
        {addend: + 10, rowChange: 1, recurring: 1},
        {addend: + 17, rowChange: 2, recurring: 1},
        {addend: + 6, rowChange: 1, recurring: 1},
        {addend: + 15, rowChange: 2, recurring: 1},
        {addend: - 10, rowChange: 1, recurring: 1},
        {addend: - 17, rowChange: 2, recurring: 1},
        {addend: - 6, rowChange: 1, recurring: 1},
        {addend: - 15, rowChange: 2, recurring: 1},
    ]],
    [PieceType.Pawn, [
        {addend: + 8, rowChange: 1, recurring: 1},
        {addend: - 8, rowChange: 1, recurring: 1},
        {addend: + 16, rowChange: 2, recurring: 1},
        {addend: - 16, rowChange: 2, recurring: 1},
        {addend: + 7, rowChange: 1, recurring: 1, pawnCapture: true},
        {addend: + 9, rowChange: 1, recurring: 1, pawnCapture: true},
        {addend: - 7, rowChange: 1, recurring: 1, pawnCapture: true},
        {addend: - 9, rowChange: 1, recurring: 1, pawnCapture: true},
    ]],
    [PieceType.Queen, [
        {addend: - 9, rowChange: 1, recurring: BOARD_SIZE},
        {addend: + 9, rowChange: 1, recurring: BOARD_SIZE},
        {addend: + 7, rowChange: 1, recurring: BOARD_SIZE},
        {addend: - 7, rowChange: 1, recurring: BOARD_SIZE},
        {addend: - 8, rowChange: 1, recurring: BOARD_SIZE},
        {addend: + 8, rowChange: 1, recurring: BOARD_SIZE},
        {addend: + 1, rowChange: 0, recurring: BOARD_SIZE},
        {addend: - 1, rowChange: 0, recurring: BOARD_SIZE},
    ]],
    [PieceType.Rook, [
        {addend: - 8, rowChange: 1, recurring: BOARD_SIZE},
        {addend: + 8, rowChange: 1, recurring: BOARD_SIZE},
        {addend: + 1, rowChange: 0, recurring: BOARD_SIZE},
        {addend: - 1, rowChange: 0, recurring: BOARD_SIZE},
    ]],
    [PieceType.Blank, []],
]);

const moveFilters = [
    removeOutOfBounds,
    removeRowWrappedMove,
    removeSameColors,
    removeShieldedSquares,
    removePawnInvalidMove,
    removeInvalidCastles,
]

const moveSucessStrategies:(
        (loc:number, 
         squares: (PieceData | null)[], 
         move:number) => (PieceData | null)[]
    )[] = [
        swordStrategy,
        flailStrategy,
        guardStrategy,
        castlingStrategy,
    ];