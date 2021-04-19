import PieceData, {PowerUpData} from "../GameLogic"


export const editSquare = (loc: number, val: PieceData) => ({
    type: 'EDIT',
    loc,
    val,
})

export const movePiece = (from: number, to: number) => ({
    type: 'MOVE_PIECE',
    from,
    to,
})

export const addPower = (loc: number, powerUpData: PowerUpData) => ({
    type: 'ADD_POWERUP',
    loc,
    powerUp: powerUpData
})