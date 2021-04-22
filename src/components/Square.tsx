import PieceData, { PowerUpData } from '../GameLogic'
import React from 'react'
import Piece from './Piece'
import PowerUp from './PowerUp'



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
        {squareData.piece === null ? <div className="empty"></div> :
         squareData.piece === undefined ? null :
            <Piece piece={squareData.piece} pId={squareData.id} /> }
        {squareData.powerUp ? <PowerUp powerUp = {squareData.powerUp} /> : null}
    </div>
)

export default Square
