import Piece from '../piece'
import React from 'react'
import VisualPiece from './VisualPiece'

//prettier-ignore
const Square = ({ id, onDrop, piece }: 
    { id?: number; onDrop?: (ev: React.DragEvent) => void; piece: (Piece | null) }) => (

    <div className="square"
        onDragOver={onDrop ? (ev) => ev.preventDefault() : undefined}
        onDrop={onDrop}
    >
            {piece ? <VisualPiece piece={piece} pId={id} /> : null}
    </div>
)

export default Square
