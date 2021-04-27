import PieceData, { PowerUpData } from '../GameLogic'
import React from 'react'
import Piece from './Piece'
import PowerUp from './PowerUp'



export interface SquareData  {
    id?: number
    piece?: PieceData | null,
    powerUp?: PowerUpData,
    onDrop?: (ev: React.DragEvent) => void
    onClick?: (ev: React.MouseEvent) => void
    highlighted: boolean,
}

//prettier-ignore
const Square = ({ squareData }: 
    {
     onDrop?: (ev: React.DragEvent) => void;
     squareData: (SquareData) }) => {
         
    const {id, piece, powerUp, onDrop, onClick, highlighted} = squareData;

    return (
    <div className={"square" + (highlighted ? " highlighted" : "")} 
        onDragOver={onDrop ? (ev) => ev.preventDefault() : undefined}
        onDrop={onDrop}
        onMouseDown={onClick}
    >
        {piece === null ? <div className="empty"></div> :
         piece === undefined ? null :
            <Piece piece={piece} pId={id} /> }
        {powerUp ? <PowerUp powerUp = {powerUp} /> : null}
    </div>
) as JSX.Element}

export default Square
