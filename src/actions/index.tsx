import Piece from "../piece"


export const editSquare = (loc: number, val: Piece) => ({
    type: 'EDIT',
    loc,
    val,
})

export const movePiece = (from: number, to: number) => ({
    type: 'MOVE_PIECE',
    from,
    to,
})