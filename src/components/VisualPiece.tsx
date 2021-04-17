import {pieceImages, PieceImageKey} from '../img/index'
import Piece from '../piece'
import { DropInfo, DropInfoType } from './Board'
import React from 'react';

const VisualPiece = ({piece, pId}: {
    piece:Piece,
    pId?:number
}) => {
    const pieceDrag = (ev:React.DragEvent) => {
        let dropInfo: DropInfo;
        if (pId) {
            dropInfo = {
                type: DropInfoType.move,
                id: pId,
            }
        } else {
            dropInfo = {
                type: DropInfoType.editSquare,
                letters: piece.letters,
            }
        }
        ev?.dataTransfer?.setData("dropInfo", JSON.stringify(dropInfo));
    }
    return (
        <div>
        <img className="piece"
            draggable={piece ? true: false}
            onDragStart={piece ? pieceDrag : () => false}
            src={pieceImages[piece.letters as PieceImageKey]}
            alt={pId ? pId.toString() : "null"}
            id={pId ? pId.toString() : "null"}
        />
        </div>
        )
}

export default VisualPiece;
