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

export default interface Piece {
    color: Color
    type: PieceType
    haveMoved: boolean
    letters: string
}

export const decodePiece = (letters: string): Piece => {
    return {
        color: letters[0] === 'w' ? Color.white : Color.black,
        type: decodePieceType(letters),
        haveMoved: false,
        letters,
    }
}

export const validateMove = (
    from: number,
    to: number,
    squares: (Piece | null)[]
): boolean => {
    return getMoves(from, squares).includes(to)
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

const getMoves = (loc: number, squares: (Piece | null)[]): number[] => {
    if (squares[loc] === null) return []
    return pieceMoveStrategies[squares[loc]!.type](loc, squares)
}

const getCaptureMoves = (loc: number, squares: (Piece | null)[]): number[] => {
    if (squares[loc] === null) return []
    return pieceCaptureOnlyStrategies[squares[loc]!.type](loc, squares)
}

const removeInvalidMoves = (
    potentialMoves: number[],
    loc: number,
    squares: (Piece | null)[]
) => {
    return potentialMoves.filter((i: number) => {
        return (
            i >= 0 &&
            i <= 63 &&
            (squares[i] === null || squares[i]?.color !== squares[loc]?.color)
        )
    })
}

const checkCheck = (color: Color, squares: (Piece | null)[]): boolean => {
    for (const [i, square] of squares.entries()) {
        if (!square || square!.color === color) continue
        const checks = getCaptureMoves(i, squares).filter((move) => {
            return (
                squares[move]?.color === color &&
                squares[move]?.type === PieceType.King
            )
        })
        if (checks.length > 0) return true
    }
    return false
}

const bishopMoves = (loc: number, squares: (Piece | null)[]): number[] => {
    let potential_moves = []
    //Move in the four diagonal directions
    const operations = [
        (n: number) => loc + n * 9,
        (n: number) => loc + n * -9,
        (n: number) => loc + n * 7,
        (n: number) => loc + n * -7,
    ]
    for (let op of operations) {
        for (let i = 1; i < BOARD_SIZE; i++) {
            potential_moves.push(op(i))
            if (squares[op(i)]) break
        }
    }
    return removeInvalidMoves(potential_moves, loc, squares)
}

//Need to implement Castling
const kingMoves = (loc: number, squares: (Piece | null)[]): number[] => {
    let potentialMoves = [-9, -8, -7, -1, 1, 7, 8, 9].map((a) => a + loc)
    potentialMoves = removeInvalidMoves(potentialMoves, loc, squares)
    if (squares[loc]?.type !== PieceType.King) return []
    console.log('Before', potentialMoves)
    potentialMoves = potentialMoves.filter((move) => {
        let newSquares = [...squares]
        newSquares[move] = newSquares[loc]
        newSquares[loc] = null
        return !checkCheck(squares[loc]!.color, newSquares)
    })
    console.log('After', potentialMoves)
    return potentialMoves
}

const knightMoves = (loc: number, squares: (Piece | null)[]): number[] => {
    let potential_moves = [10, 17, 6, 15, -10, -17, -6, -15].map((n) => n + loc)
    return removeInvalidMoves(potential_moves, loc, squares)
}

const pawnMoves = (loc: number, squares: (Piece | null)[]): number[] => {
    let potential_moves = []
    let [op, startingPos] =
        squares[loc]?.color === Color.white
            ? [(b: number) => loc + b, Math.floor(loc / 8) === 1]
            : [(b: number) => loc - b, Math.floor(loc / 8) === 6]

    //Normal Move
    potential_moves.push(op(8))

    //Double Move
    if (startingPos) {
        potential_moves.push(op(16))
    }
    const moves = removeInvalidMoves(potential_moves, loc, squares)
    return moves.concat(pawnAttackMoves(loc, squares))
}

const queenMoves = (loc: number, squares: (Piece | null)[]): number[] => {
    let potential_moves = []
    const operations = [
        (n: number) => loc + n * 9,
        (n: number) => loc + n * -9,
        (n: number) => loc + n * 7,
        (n: number) => loc + n * -7,
        (n: number) => loc + n * 8,
        (n: number) => loc + n * -8,
        (n: number) => loc + n * 1,
        (n: number) => loc + n * -1,
    ]
    for (const op of operations) {
        for (let i = 1; i < BOARD_SIZE; i++) {
            potential_moves.push(op(i))
            if (squares[op(i)]) break
        }
    }
    return removeInvalidMoves(potential_moves, loc, squares)
}

const rookMoves = (loc: number, squares: (Piece | null)[]): number[] => {
    let potential_moves = []
    const operations = [
        (n: number) => loc + n * 8,
        (n: number) => loc + n * -8,
        (n: number) => loc + n * 1,
        (n: number) => loc + n * -1,
    ]
    for (let op of operations) {
        for (let i = 1; i < BOARD_SIZE; i++) {
            potential_moves.push(op(i))
            if (squares[op(i)]) break
        }
    }
    return removeInvalidMoves(potential_moves, loc, squares)
}

const pawnAttackMoves = (loc: number, squares: (Piece | null)[]): number[] => {
    let op =
        squares[loc]?.color === Color.white
            ? (b: number) => loc + b
            : (b: number) => loc - b
    return removeInvalidMoves([op(7), op(9)], loc, squares)
}

//King attack moves used, as King moves checks for checks,
//i.e in the case that a King walks into another king's "zone", King moves will
//not capture it
const kingAttackMoves = (loc: number, squares: (Piece | null)[]): number[] => {
    return removeInvalidMoves(
        [-9, -8, -7, -1, 1, 7, 8, 9].map((a) => a + loc),
        loc,
        squares
    )
}

const filterCaptureMoves = (
    strategy: (loc: number, squares: (Piece | null)[]) => number[]
) => {
    return (loc: number, squares: (Piece | null)[]) => {
        return strategy(loc, squares).filter((move: number) => squares[move])
    }
}

const pieceMoveStrategies = {
    [PieceType.Bishop]: bishopMoves,
    [PieceType.King]: kingMoves,
    [PieceType.Knight]: knightMoves,
    [PieceType.Pawn]: pawnMoves,
    [PieceType.Queen]: queenMoves,
    [PieceType.Rook]: rookMoves,
    [PieceType.Blank]: () => [],
}

const pieceCaptureOnlyStrategies = {
    [PieceType.Bishop]: filterCaptureMoves(
        pieceMoveStrategies[PieceType.Bishop]
    ),
    [PieceType.King]: kingAttackMoves,
    [PieceType.Knight]: filterCaptureMoves(
        pieceMoveStrategies[PieceType.Knight]
    ),
    [PieceType.Pawn]: pawnAttackMoves,
    [PieceType.Queen]: filterCaptureMoves(pieceMoveStrategies[PieceType.Queen]),
    [PieceType.Rook]: filterCaptureMoves(pieceMoveStrategies[PieceType.Rook]),
    [PieceType.Blank]: () => [],
}
