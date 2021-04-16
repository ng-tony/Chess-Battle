import React from 'react'
import Piece from '../piece'
import Square from './Square'

import {validateMove} from '../piece'

const Board = ({squares, movePiece}:{
        squares:(Piece | null)[],
        movePiece:(from: number, to: number) => void
    }) => {
    const squareDrop = (id:number) => {
        return (ev: React.DragEvent) => {
            ev.preventDefault();
            var draggedId = parseInt(ev.dataTransfer.getData("id"));
            if(validateMove(draggedId, id, squares)) movePiece(draggedId, id);
            //document.getElementById(sqId).appendChild(document.getElementById(data));
            return;
        }
    }
    return (
        <div>
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