import React from 'react'
import PropTypes from 'prop-types'
import testpiece from '../img/bk.svg'
import  * as piece_images from '../img/index'
import {validateMove} from '../piece'

const Board = ({squares, movePiece}) => {
    function squareDrop(id){
        return (ev) => {
            ev.preventDefault();
            var draggedId = parseInt(ev.dataTransfer.getData("id"));
            console.log(draggedId);
            if(validateMove(draggedId, id, squares)) movePiece(draggedId, id);
            //document.getElementById(sqId).appendChild(document.getElementById(data));
            console.log(id)
            return;
        }
    }
    return (
        <div>
            {Array(8).fill().map((_, i) => {
            return (
                <div className="board-row" key={i}>
                    {squares.slice(i*8, i*8 + 8).map((square, j) => {
                        const id = i*8 + j;
                        return (
                            <Square
                                id={id}
                                onDrop={squareDrop(i*8 + j)}
                                piece={squares[id] ? squares[id].letters: null}
                        />);
                    })}
                </div>
            )
            })}
        </div>
    );
}

Board.propTypes = {
    squares: PropTypes.array.isRequired,
    movePiece: PropTypes.func.isRequired,
}

const Square = ({id, onDrop, piece}) => (
    <div className="square"
       onDragOver={(ev) => ev.preventDefault(ev)}
       onDrop={onDrop}
      >
        {piece ? <Piece piece={piece} pId={id}/> : null}
      </div>
)

Square.propTypes = {
    onDrop: PropTypes.func.isRequired,
    id: PropTypes.string,
    piece: PropTypes.object
}

const Piece = ({piece, pId}) => {
    const pieceDrag = (ev) => {
        ev.dataTransfer.setData("id", pId);
    }
    console.log("test")
    console.log(piece.letters);
    console.log(piece_images[piece.letters])
    return (
        <div>
        <img className="piece"
            draggable={piece ? true: false}
            onDragStart={piece ? pieceDrag : () => false}
            src={piece_images[piece].default}
            alt={pId}
            id={pId}
        />
        </div>
        )
}


export default Board;