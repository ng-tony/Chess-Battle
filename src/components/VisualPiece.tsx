import {pieceImages, PieceImageKey} from '../img/index'
import Piece from '../piece'
import React from 'react';

const VisualPiece = ({piece, pId}: {
    piece:Piece,
    pId:number
}) => {
    const pieceDrag = (ev:React.DragEvent) => {
        ev?.dataTransfer?.setData("id", pId.toString());
    }
    return (
        <div>
        <img className="piece"
            draggable={piece ? true: false}
            onDragStart={piece ? pieceDrag : () => false}
            src={pieceImages[piece.letters as PieceImageKey]}
            alt={pId.toString()}
            id={pId.toString()}
        />
        </div>
        )
}

export default VisualPiece;
