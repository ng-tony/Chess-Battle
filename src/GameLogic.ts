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

export const validateMove = (
    from: number,
    to: number,
    squares: (PieceData | null)[]
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

const getMoves = (loc: number, squares: (PieceData | null)[]): number[] => {
    if (squares[loc] === null) return []
    return pieceMoveStrategies[squares[loc]!.type](loc, squares)
}

const getCaptureMoves = (loc: number, squares: (PieceData | null)[]): number[] => {
    if (squares[loc] === null) return []
    return pieceCaptureOnlyStrategies[squares[loc]!.type](loc, squares)
}

const filterInvalidMoves = (
    potentialMoves: number[],
    loc: number,
    squares: (PieceData | null)[]
) => {
    return potentialMoves.filter((i: number) => {
        return (
            i >= 0 &&
            i <= 63 &&
            (squares[i]?.color !== squares[loc]?.color)
        )
    })
}

const moveWrappedRow = (prev:number, move:number, expectedRowChange:number) => {
    const prevRow = Math.floor(prev/BOARD_SIZE);
    const moveRow = Math.floor(move/BOARD_SIZE);
    return Math.abs(prevRow - moveRow) - expectedRowChange;
}

const horizontalOutBoundCheck = (prev:number, move: number) => {
    return moveWrappedRow(prev, move, 0);
}


const diagonalOutBoundCheck = (prev:number, move: number) => {
    return moveWrappedRow(prev, move, 1);
}

const checkCheck = (color: Color, squares: (PieceData | null)[]): boolean => {
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

const bishopMoves = (loc: number, squares: (PieceData | null)[]): number[] => {
    let potentialMoves = []
    //Move in the four diagonal directions
    const operations = [
        {op: (n: number) => loc + n * -9},
        {op: (n: number) => loc + n * 9},
        {op: (n: number) => loc + n * 7},
        {op: (n: number) => loc + n * -7}
    ]
    for (let {op} of operations) {
        for (let i = 1; i < BOARD_SIZE; i++) {
            if(moveWrappedRow(loc, op(i), i)) break;
            potentialMoves.push(op(i))
            if (squares[op(i)]) break
        }
    }
    return filterInvalidMoves(potentialMoves, loc, squares)
}

//Need to implement Castling
const kingMoves = (loc: number, squares: (PieceData | null)[]): number[] => {
    let potentialMoves = [
        { relCoord: -9, expectedRowMovement: 1 },
        { relCoord: -8, expectedRowMovement: 1 },
        { relCoord: -7, expectedRowMovement: 1 },
        { relCoord: -1, expectedRowMovement: 1 },
        { relCoord: 1, expectedRowMovement: 0 },
        { relCoord: 7, expectedRowMovement: 0 },
        { relCoord: 8, expectedRowMovement: 1 },
        { relCoord: 9, expectedRowMovement: 1 },
    ]
    let filteredMoves = convertPotentialMoveToActual(loc, squares, potentialMoves);
    //Check if walking into a check
    if (squares[loc]?.type !== PieceType.King) return []
    filteredMoves = filteredMoves.filter((move) => {
        let newSquares = [...squares]
        newSquares[move] = newSquares[loc]
        newSquares[loc] = null
        return !checkCheck(squares[loc]!.color, newSquares)
    })
    return filteredMoves;
}

const knightMoves = (loc: number, squares: (PieceData | null)[]): number[] => {
    const potentialMoves = [
        { relCoord: 10, expectedRowMovement: 1 },
        { relCoord: 17, expectedRowMovement: 2 },
        { relCoord: 6, expectedRowMovement: 1 },
        { relCoord: 15, expectedRowMovement: 2 },
        { relCoord: -10, expectedRowMovement: 1 },
        { relCoord: -17, expectedRowMovement: 2 },
        { relCoord: -6, expectedRowMovement: 1 },
        { relCoord: -15, expectedRowMovement: 2 },
    ];
    return convertPotentialMoveToActual(loc, squares, potentialMoves);
}

const convertPotentialMoveToActual = (loc:number, squares: (PieceData | null)[], potentialMoves: {relCoord:number, expectedRowMovement:number}[]) => {
    return filterInvalidMoves(
        potentialMoves.map(({ relCoord, expectedRowMovement }) => {
            return { coord: relCoord + loc, expectedRowMovement }
        }).filter(({ coord, expectedRowMovement }) => {
            return !moveWrappedRow(loc, coord, expectedRowMovement);
        }).map(({coord})=> {
            return coord;
        }),
        loc,
        squares);
}

const pawnMoves = (loc: number, squares: (PieceData | null)[]): number[] => {
    let potentialMoves = []
    let [op, startingPos] =
        squares[loc]?.color === Color.white
            ? [(b: number) => loc + b, Math.floor(loc / 8) === 1]
            : [(b: number) => loc - b, Math.floor(loc / 8) === 6]

    //Normal Move
    potentialMoves.push(op(8))

    //Double Move
    if (startingPos) {
        potentialMoves.push(op(16))
    }
    const moves = filterInvalidMoves(potentialMoves, loc, squares)
    return moves
        .filter((move) =>  squares[move] === null)
        .concat(pawnAttackMoves(loc, squares));
}

const queenMoves = (loc: number, squares: (PieceData | null)[]): number[] => {
    let potentialMoves = []
    //Vertical bound checks are handled with out of bounds checks
    const operations = [
        {op: (n: number) => loc + n * -9, boundCheck: diagonalOutBoundCheck},
        {op: (n: number) => loc + n * 9, boundCheck: diagonalOutBoundCheck},
        {op: (n: number) => loc + n * 7, boundCheck: diagonalOutBoundCheck},
        {op: (n: number) => loc + n * -7, boundCheck: diagonalOutBoundCheck},
        {op: (n: number) => loc + n * 8, boundCheck: (prev: number, m:number) => false},
        {op: (n: number) => loc + n * -8, boundCheck: (prev: number, m:number) => false},
        {op: (n: number) => loc + n * 1, boundCheck: horizontalOutBoundCheck},
        {op: (n: number) => loc + n * -1, boundCheck: horizontalOutBoundCheck},
    ]
    for (const {op, boundCheck} of operations) {
        for (let i = 1, prev = loc; i < BOARD_SIZE; i++) {
            if(boundCheck(prev,op(i))) break;
            potentialMoves.push(op(i))
            if (squares[op(i)]) break
            prev = op(i);
        }
    }
    return filterInvalidMoves(potentialMoves, loc, squares)
}

const rookMoves = (loc: number, squares: (PieceData | null)[]): number[] => {
    let potentialMoves = []
    const operations = [
        {op: (n: number) => loc + n * -8, boundCheck: (prev: number, m:number) => false},
        {op: (n: number) => loc + n * 8, boundCheck: (prev: number, m:number) => false},
        {op: (n: number) => loc + n * 1, boundCheck: horizontalOutBoundCheck},
        {op: (n: number) => loc + n * -1, boundCheck: horizontalOutBoundCheck},
    ]
    for (let {op, boundCheck} of operations) {
        for (let i = 1, prev = loc; i < BOARD_SIZE; i++) {
            if(boundCheck(prev, op(i))) break;
            potentialMoves.push(op(i))
            if (squares[op(i)]) break
            prev = op(i);
        }
    }
    return filterInvalidMoves(potentialMoves, loc, squares)
}

const pawnAttackMoves = (loc: number, squares: (PieceData | null)[]): number[] => {
    let op =
        squares[loc]?.color === Color.white
            ? (b: number) => loc + b
            : (b: number) => loc - b
    return filterInvalidMoves([op(7), op(9)], loc, squares).filter(move => 
        squares[move] !== null
    )
}

//King attack moves used, as King moves checks for checks,
//i.e in the case that a King walks into another king's "zone", King moves will
//not capture it
const kingAttackMoves = (loc: number, squares: (PieceData | null)[]): number[] => {
    return filterInvalidMoves(
        [-9, -8, -7, -1, 1, 7, 8, 9].map((a) => a + loc),
        loc,
        squares
    )
}


const filterCaptureMoves = (
    moveStrategy: (loc: number, squares: (PieceData | null)[]) => number[]
) => {
    return (loc: number, squares: (PieceData | null)[]) => {
        return moveStrategy(loc, squares).filter((move: number) => {
            return squares[move] &&
                    squares[move]?.color !== squares[loc]?.color;
        });
    }
}

const hasPowerUp = (squares: (PieceData | null)[],  move:number, pupType:PowerUpType) => {
    return squares[move] && squares[move]!.powerUps.length > 0 && squares[move]?.powerUps.reduce( (acc, powerUp) => {
        return acc || powerUp.type === pupType
    }, false)
}

const shieldStrategy = (loc: number, squares: (PieceData | null)[], move: number): boolean => {
    if(hasPowerUp(squares, move, PowerUpType.Shield)) {
        return false;
    }
    return true;
}

const guardStrategy = (loc: number, squares: (PieceData | null)[], move: number): (PieceData | null)[] => {
    for (const [i, square] of squares.entries()) {
        if (!square || square!.color === squares[move]?.color) continue
        if(hasPowerUp(squares, i, PowerUpType.Guard) &&
            getCaptureMoves(i, squares).includes(move)) {
            return moveSucessResults(i, move, squares)
        }
    }
    return squares;
}

const swordStrategy = (loc: number, squares: (PieceData | null)[], move: number): (PieceData | null)[] => {
    if(hasPowerUp(squares, move, PowerUpType.Sword)){
        for (const m of [8, -8].map((a) => a + move)){
            if (squares[m] &&
                squares[m]?.color !== squares[move]?.color &&
                !hasPowerUp(squares, m, PowerUpType.Shield)){
                    squares[m] = null;
            }
        }
        for (const m of [1, -1].map((a) => a + move)){
            if (squares[m] &&
                squares[m]?.color !== squares[move]?.color &&
                !hasPowerUp(squares, m, PowerUpType.Shield) &&
                !horizontalOutBoundCheck(move, m)){
                    squares[m] = null;
            }
        }

      
    }
    return squares;
}

const flailStrategy = (loc: number, squares: (PieceData | null)[], move: number): (PieceData | null)[] => {
    if(hasPowerUp(squares, move, PowerUpType.Flail)){
        for (const m of [9, -9, 7, -7].map((a) => a + move)){
            if (squares[m] &&
                squares[m]?.color !== squares[move]?.color  &&
                !hasPowerUp(squares, m, PowerUpType.Shield) && 
                !diagonalOutBoundCheck(move, m)){
                    squares[m] = null;
            }
        }
    }
    return squares;
}


const defenderStrategies:(
    (loc:number, squares: (PieceData | null)[], move:number) => boolean)[] = [
        shieldStrategy,
    ];

export const moveSucessStrategies:(
    (loc:number, squares: (PieceData | null)[], move:number) => (PieceData | null)[])[] = [
        swordStrategy,
        flailStrategy,
        guardStrategy,
    ];

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

const filterWithStrategies =(
    strat: (loc: number, squares: (PieceData | null)[]) => number[],
    filteringStrats:  ((loc:number, squares: (PieceData | null)[], move: number) => boolean)[]):
    (loc: number, squares: (PieceData | null)[]) => number[] => {
        return (loc: number, squares: (PieceData | null)[]): number[] => {
            return strat(loc, squares).filter((move) => {
                return filteringStrats.every((fStrat) => {
                    return fStrat(loc, squares, move);
                })
            });
        };
}


const pieceMoveStrategies = {
    [PieceType.Bishop]: filterWithStrategies(bishopMoves, defenderStrategies),
    [PieceType.King]: filterWithStrategies(kingMoves, defenderStrategies),
    [PieceType.Knight]: filterWithStrategies(knightMoves, defenderStrategies),
    [PieceType.Pawn]: filterWithStrategies(pawnMoves, defenderStrategies),
    [PieceType.Queen]: filterWithStrategies(queenMoves, defenderStrategies),
    [PieceType.Rook]: filterWithStrategies(rookMoves, defenderStrategies),
    [PieceType.Blank]: () => [],
}

const pieceCaptureOnlyStrategies = {
    [PieceType.Bishop]: filterCaptureMoves(pieceMoveStrategies[PieceType.Bishop]),
    [PieceType.King]: kingAttackMoves,
    [PieceType.Knight]: filterCaptureMoves(pieceMoveStrategies[PieceType.Knight]),
    [PieceType.Pawn]: pawnAttackMoves,
    [PieceType.Queen]: filterCaptureMoves(pieceMoveStrategies[PieceType.Queen]),
    [PieceType.Rook]: filterCaptureMoves(pieceMoveStrategies[PieceType.Rook]),
    [PieceType.Blank]: () => [],
}
