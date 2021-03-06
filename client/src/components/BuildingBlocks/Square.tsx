import "./Square.scss"
import PieceData, { PowerUpData } from '../../GameLogic'
import React from 'react'
import Piece from './Piece'
import PowerUp from './PowerUp'


export const NULL_SQUARE = {id:-1, highlighted:false, selected:false, lastMove:false} as SquareData;

export interface SquareData  {
    id?: number
    piece?: PieceData | null,
    powerUp?: PowerUpData,
    highlighted: boolean,
    lastMove: boolean,
    selected: boolean,
}

//prettier-ignore
const Square = ({ squareData, onDrop, onClick }: 
    {
    squareData: (SquareData),
    onDrop?: (ev: React.DragEvent) => void,
    onClick?: (ev: React.MouseEvent) => void,
    }) => {

    const {id, piece, powerUp, highlighted, lastMove, selected} = squareData;

    return (
    <div className={"square" + (highlighted || (selected && (piece || powerUp)) ? " highlighted" : (lastMove ? " lastMove" : ""))} 
        onDragOver={onDrop ? (ev) => ev.preventDefault() : undefined}
        onDrop={onDrop}
        onMouseDown={onClick}
    >
        {piece === null ? <div className="empty"></div> :
         piece === undefined ? null :
            <Piece piece={piece} selected={selected} pId={id} /> }
        {powerUp ? <PowerUp powerUp = {powerUp} /> : null}
    </div>
) as JSX.Element}

export default Square
