export const edit = (loc, val) => ({
    type: 'EDIT',
    loc,
    val,
})

export const movePiece = (from, to) => ({
    type: 'MOVE_PIECE',
    from,
    to,
})