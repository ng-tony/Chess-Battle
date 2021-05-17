import { AnyAction, ThunkAction } from "@reduxjs/toolkit"
import { RootStateOrAny } from "react-redux"
import { ServerMessage } from "../App"
import { SquareData } from "../components/BuildingBlocks/Square"
import PieceData, {PowerUpData} from "../GameLogic"


export const editSquare = (loc: number, val: PieceData) => ({
    type: 'EDIT',
    localOnly: false,
    loc,
    val,
})

export const movePiece = (from: number, to: number) => ({
    type: 'MOVE_PIECE',
    localOnly: false,
    from,
    to,
})

export const addPower = (loc: number, powerUpData: PowerUpData) => ({
    type: 'ADD_POWERUP',
    localOnly: false,
    loc,
    powerUp: powerUpData
})

export const removePowers = (loc: number) => ({
    type: 'REMOVE_POWERUPS',
    localOnly: false,
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


export const jumpToHistory = (step: number) => ({
    type: 'JUMP',
    step: step,
})

export const consolidateMove = (message:ServerMessage):ThunkAction<void, RootStateOrAny, unknown, AnyAction> =>
    (dispatch) => {
    const {action, jump} = message;
    action.localOnly = true;
    dispatch(jumpToHistory(jump!))
    dispatch(action);
    // if (history[moveNumber] !== action) {
    //     let newFuture = history.splice(moveNumber);
    //     dispatch(jumpToHistory(moveNumber))
    //     for(let move of newFuture) {
    //         if ("localOnly" in move) 
    //             move.localOnly = true;
    //         dispatch(move);
    //     }
    // }
}


export const applyHistory = (message:ServerMessage):ThunkAction<void, RootStateOrAny, unknown, AnyAction> =>
    (dispatch) => {
    const {history} = message;
    if(!history) return;
    for(let item of history) {
        dispatch(consolidateMove(item))
    }
}
