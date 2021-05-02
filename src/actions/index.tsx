import { SquareData } from "../components/BuildingBlocks/Square"
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

export const removePowers = (loc: number) => ({
    type: 'REMOVE_POWERUPS',
    loc,
})

export const undo = () => ({
    type: 'UNDO',
})

export const redo = () => ({
    type: 'REDO',
})

export const flipBoard = () => ({
    type: 'FLIP_BOARD',
})


export const selectSquare = (selectedSquare: SquareData) => ({
    type: 'SELECT_SQUARE',
    selectedSquare,
})


export const toggleEditor = () => ({
    type: 'TOGGLE_EDITOR',
})

export const toggleAbout = () => ({
    type: 'TOGGLE_ABOUT',
})
