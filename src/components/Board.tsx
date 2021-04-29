import './Board.scss'
import React from 'react'
import PieceData, { decodePiece, getMoves, PowerUpData } from '../GameLogic'
import Square, {SquareData} from './BuildingBlocks/Square'
import {sounds} from '../assets/sounds/index'

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

const moveAudio = new Audio(sounds.move.default);
// const captureAudio = new Audio(sounds.capture);
export type BoardProps = {
    squares:(PieceData | null)[],
    selectedSquare:number,
    lastMove: {from:number, to:number},
    movePiece:(from: number, to: number) => void,
    editSquare:(loc:number, piece: PieceData) => void,
    addPower:(loc:number, powerUp: PowerUpData) => void,
    removePower:(loc:number) => void,
    selectSquare:(loc:number) => void,
}

const Board:React.FC<BoardProps> = ({
    squares,
    selectedSquare,
    lastMove,
    movePiece,
    editSquare,
    addPower,
    removePower,
    selectSquare}) => {

    const makeMove = (from: number, to: number):boolean => {
        if(validateMove(from, to, squares)) {
            movePiece(from, to);
            moveAudio.play()
            return true;
        }
        return false;
    }
    const squareDrop = (id: number) => {
        return (ev: React.DragEvent) => {
            ev.preventDefault();
            let dropInfo = JSON.parse(ev.dataTransfer.getData("dropInfo")) as DropInfo;
            switch (dropInfo.type) {
                case DropInfoType.move:
                    makeMove(dropInfo.id!, id)
                    break;
                case DropInfoType.editSquare:
                    editSquare(id, decodePiece(dropInfo.letters!));
                    moveAudio.play()
                    break;
                case DropInfoType.addPowerUp:
                    if (dropInfo.powerUp)
                        if(dropInfo.powerUp.type === PowerUpType.Clear)
                            removePower(id);
                        else
                            addPower(id, dropInfo.powerUp);
                    break;
            }
        }
    }

    const squareClick = (id: number) => {
        return (e: React.MouseEvent) => {
            if(!makeMove(selectedSquare, id)) {
                selectSquare(id);
            }
        }
    }
    
    const squaresToBeHighlighted = getMoves(selectedSquare, squares);

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
                                    onClick: squareClick(id),
                                    highlighted:squaresToBeHighlighted.includes(id),
                                    lastMove: (lastMove.from === id) || (lastMove.to === id),
                                    selected: selectedSquare === id,
                                }
                                return (
                                    <Square
                                        key = {id}
                                        squareData = {squareData}
                                    />);
                            })}
                        </div>
                        )
                })}
                <div className="ruler file">
                    <div className="rule">h</div>
                    <div className="rule">g</div>
                    <div className="rule">f</div>
                    <div className="rule">e</div>
                    <div className="rule">d</div>
                    <div className="rule">c</div>
                    <div className="rule">b</div>
                    <div className="rule">a</div>
                </div>
                <div className="ruler rank">
                    <div className="rule"><p>1</p></div>
                    <div className="rule"><p>2</p></div>
                    <div className="rule"><p>3</p></div>
                    <div className="rule"><p>4</p></div>
                    <div className="rule"><p>5</p></div>
                    <div className="rule"><p>6</p></div>
                    <div className="rule"><p>7</p></div>
                    <div className="rule"><p>8</p></div>
                </div>
            </div>
        </div>
    );
}




export default Board;