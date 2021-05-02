import './Board.scss'
import React from 'react'
import PieceData, { decodePiece, getMoves, PowerUpData } from '../GameLogic'
import Square, { SquareData } from './BuildingBlocks/Square'

import { validateMove, PowerUpType } from '../GameLogic'

export enum DropInfoType {
    move,
    editSquare,
    addPowerUp,
}

export interface DropInfo {
    type: DropInfoType
    id?: number
    letters?: string
    powerUp?: PowerUpData
}

export type BoardProps = {
    squares: (PieceData | null)[]
    selectedSquare: SquareData,
    lastMove: { from: number; to: number }
    movePiece: (from: number, to: number) => void
    editSquare: (loc: number, piece: PieceData) => void
    addPower: (loc: number, powerUp: PowerUpData) => void
    removePower: (loc: number) => void
    selectSquare: (squareData: SquareData) => void
}

const Board: React.FC<BoardProps> = ({
    squares,
    selectedSquare,
    lastMove,
    movePiece,
    editSquare,
    addPower,
    removePower,
    selectSquare,
}) => {
    const makeMove = (from: number, to: number): boolean => {
        if (validateMove(from, to, squares)) {
            movePiece(from, to)
            return true
        }
        return false
    }

    const editPowerUp = (id:number) => {
        if (selectedSquare?.powerUp?.type === PowerUpType.Clear) {
            if(squares[id]?.powerUps.length !== 0) removePower(id)
        }
        else addPower(id, selectedSquare.powerUp!)
    }

    const onDropHandlerFactory = ({ id }: SquareData) => {
        return (ev: React.DragEvent) => {
            ev.preventDefault()
            let dropInfo = JSON.parse(ev.dataTransfer.getData('dropInfo')) as DropInfo
            if (id !== undefined) {
                switch (dropInfo.type) {
                    case DropInfoType.move:
                        makeMove(dropInfo.id!, id)
                        break
                    case DropInfoType.editSquare:
                        editSquare(id, decodePiece(dropInfo.letters!))
                        break
                    case DropInfoType.addPowerUp:
                        if (dropInfo.powerUp)
                            editPowerUp(id)
                        break
                }
            } else { //Dropped onto the editors
                //Remove piece
                editSquare(dropInfo.id!, decodePiece('bb')) 
            }
        }
    }

    const squareClick = (squareData:SquareData) => {
        return (ev: React.MouseEvent) => {
            const { id } = squareData;
            let clearSelected = false;
            if (id !== undefined) {
                if (selectedSquare?.id !== undefined && selectedSquare.id >= 0) {
                    if (makeMove(selectedSquare.id, id)) {
                        clearSelected = true;
                    }
                } else {
                    if (selectedSquare.piece) {
                        editSquare(id, selectedSquare.piece!)
                        clearSelected = true;
                    }
                    if (selectedSquare.powerUp) {
                        editPowerUp(id)
                        clearSelected = true;
                    }
                }
            }
            clearSelected ? selectSquare({} as  SquareData) : selectSquare(squareData)
        }
    }

    const squaresToBeHighlighted = selectedSquare.id ? getMoves(selectedSquare.id, squares) : []

    return (
        <div className="board">
            <div className="container">
                {Array(8)
                    .fill(null)
                    .map((_, i) => {
                        return (
                            <div className="row" key={i}>
                                {squares.slice(i * 8, i * 8 + 8).map((square, j) => {
                                    const id = i * 8 + j
                                    let squareData: SquareData = {
                                        id,
                                        piece: squares[id] ? squares[id] : null,
                                        highlighted: squaresToBeHighlighted.includes(id),
                                        lastMove: lastMove.from === id || lastMove.to === id,
                                        selected: selectedSquare.id === id,
                                    }
                                    return (
                                        <Square
                                            key={id}
                                            squareData={squareData}
                                            onDrop={onDropHandlerFactory(squareData)}
                                            onClick={squareClick(squareData)}
                                        />
                                    )
                                })}
                            </div>
                        )
                    })}
                <div className="ruler file">
                    <div className="rule">
                        <p>h</p>
                    </div>
                    <div className="rule">
                        <p>g</p>
                    </div>
                    <div className="rule">
                        <p>f</p>
                    </div>
                    <div className="rule">
                        <p>e</p>
                    </div>
                    <div className="rule">
                        <p>d</p>
                    </div>
                    <div className="rule">
                        <p>c</p>
                    </div>
                    <div className="rule">
                        <p>b</p>
                    </div>
                    <div className="rule">
                        <p>a</p>
                    </div>
                </div>
                <div className="ruler rank">
                    <div className="rule">
                        <p>1</p>
                    </div>
                    <div className="rule">
                        <p>2</p>
                    </div>
                    <div className="rule">
                        <p>3</p>
                    </div>
                    <div className="rule">
                        <p>4</p>
                    </div>
                    <div className="rule">
                        <p>5</p>
                    </div>
                    <div className="rule">
                        <p>6</p>
                    </div>
                    <div className="rule">
                        <p>7</p>
                    </div>
                    <div className="rule">
                        <p>8</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Board
