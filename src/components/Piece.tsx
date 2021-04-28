import {pieceImages, PieceImageKey, powerUpImages, PowerUpImageKey} from '../assets/img/index'
import PieceData from '../GameLogic'
import { DropInfo, DropInfoType } from './Board'
import React from 'react';

const VisualPiece = ({piece, selected, pId}: {
    piece:PieceData,
    selected: boolean,
    pId?:number
}) => {
    const pieceDrag = (ev:React.DragEvent) => {
        let dropInfo: DropInfo;
        if (pId as number >= 0) {
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

    const layeredImages = piece.powerUps.reduce((acc, pup) => {
        return acc + "url(" + powerUpImages[pup.type as PowerUpImageKey] + "),"
    }, "") + "url(" + pieceImages[piece.letters as PieceImageKey] + ")"

    return (
            <div className="piece"
                draggable={piece ? true: false}
                onDragStart={piece ? pieceDrag : () => false}
                id={pId !== undefined ? pId.toString() : "null"}
                style={{
                    backgroundImage: layeredImages,
                   // opacity: selected ? "70%" : "100%",
                }
                }
            ></div>
    )
}

export default VisualPiece;
