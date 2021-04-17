import React from 'react'
import Piece, { decodePiece } from '../piece'
import Square from './Square'

import {validateMove} from '../piece'

export enum DropInfoType {
    move,
    editSquare,
}

export interface DropInfo {
    type: DropInfoType,
    id?: number,
    letters?: string,
}


const Board = ({squares, movePiece, editSquare}:{
        squares:(Piece | null)[],
        movePiece:(from: number, to: number) => void,
        editSquare:(loc:number, piece: Piece) => void,
    }) => {
    const squareDrop = (id: number) => {
        return (ev: React.DragEvent) => {
            ev.preventDefault();
            let dropInfo = JSON.parse(ev.dataTransfer.getData("dropInfo")) as DropInfo;
            switch (dropInfo.type) {
                case DropInfoType.move:
                    if(validateMove(dropInfo.id!, id, squares)) movePiece(dropInfo.id!, id);
                    return;
                case DropInfoType.editSquare:
                    editSquare(id, decodePiece(dropInfo.letters!));
                    return;
            }
        }
    }
    return (
        <div className="board">
            {Array(8).fill(null).map((_, i) => {
            return (
                <div className="board-row" key={i}>
                    {squares.slice(i*8, i*8 + 8).map((square, j) => {
                        const id = i*8 + j;
                        return (
                            <Square
                                id={id}
                                onDrop={squareDrop(i*8 + j)}
                                piece={squares[id] ? squares[id]: null}
                            />);
                    })}
                </div>
                )
            })}
        </div>
    );
}




export default Board;