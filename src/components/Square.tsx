import PieceData, { PowerUpData } from '../GameLogic'
import React from 'react'
import VisualPiece from './VisualPiece'
import PowerUp from './PowerUp'
import invSquare from '../img/1x1.png'


export interface SquareData  {
    id?: number
    piece?: PieceData | null,
    powerUp?: PowerUpData,
    onDrop?: (ev: React.DragEvent) => void
}

//prettier-ignore
const Square = ({ squareData }: 
    {
     onDrop?: (ev: React.DragEvent) => void;
     squareData: (SquareData) }) => (

    <div className="square"
        onDragOver={squareData.onDrop ? (ev) => ev.preventDefault() : undefined}
        onDrop={squareData.onDrop}
    >
        {squareData.piece === null ? <img className="empty" src={invSquare} alt=""/> :
            squareData.piece === undefined ? null :
            <VisualPiece piece={squareData.piece} pId={squareData.id} /> }
        {squareData.powerUp ? <PowerUp powerUp = {squareData.powerUp} /> : null}
    </div>
)

export default Square
