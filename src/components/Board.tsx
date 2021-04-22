import React from 'react'
import PieceData, { decodePiece, PowerUpData } from '../GameLogic'
import Square, {SquareData} from './Square'

import {validateMove, PowerUpType} from '../GameLogic'

export enum DropInfoType {
    move,
    editSquare,
    addPowerUp,
}

export interface DropInfo {
    type: DropInfoType,
    id?: number,
    letters?: string,
    powerUp?: PowerUpData,
}


const Board = ({squares, movePiece, editSquare, addPower, removePower}:{
        squares:(PieceData | null)[],
        movePiece:(from: number, to: number) => void,
        editSquare:(loc:number, piece: PieceData) => void,
        addPower:(loc:number, powerUp: PowerUpData) => void,
        removePower:(loc:number) => void,
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
                case DropInfoType.addPowerUp:
                    if (dropInfo.powerUp)
                        if(dropInfo.powerUp.type === PowerUpType.Clear)
                            removePower(id);
                        else
                            addPower(id, dropInfo.powerUp);
                    return;
            }
        }
    }
    return (
        <div className="board">
            <div className="container">
            {Array(8).fill(null).map((_, i) => {
                return (
                    <div className="row" key={i}>
                        {squares.slice(i*8, i*8 + 8).map((square, j) => {
                            const id = i*8 + j;
                            let squareData: SquareData = {
                                id,
                                onDrop: squareDrop(id),
                                piece: squares[id] ? squares[id]: null,

                            }
                            return (
                                <Square
                                    squareData = {squareData}
                                />);
                        })}
                    </div>
                    )
            })}
            </div>
        </div>
    );
}




export default Board;