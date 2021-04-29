import './Editor.scss'
import React from "react";
import Square, {SquareData} from "./BuildingBlocks/Square";
import {decodePiece} from '../GameLogic'

const Editor =  () => {
    const whitePieces =[
                        decodePiece('wp'), decodePiece('wr'), decodePiece('wb'),
                        decodePiece('wn'), decodePiece('wk'), decodePiece('wq'),
                        decodePiece('wz'),
                       ]
    const blackPieces =[
                        decodePiece('bp'), decodePiece('br'), decodePiece('bb'),
                        decodePiece('bn'), decodePiece('bk'), decodePiece('bq'),
                        decodePiece('bz'),
                       ]
    return <div className="editor">
        <div className="container">
            <div className="row">
                {whitePieces.map((piece, i) => {
                    let squareData : SquareData = {
                        piece,
                        onClick: (e: React.MouseEvent) =>  {},
                        highlighted: false,
                        lastMove: false,
                        selected: false,
                    }
                    return <Square key={i} squareData={squareData}/>
                })}
            </div>
            <div className="row">
                {blackPieces.map((piece, i) => {
                    let squareData : SquareData = {
                        piece,
                        onClick: (e: React.MouseEvent) =>  {},
                        highlighted: false,
                        lastMove: false,
                        selected: false,
                    }
                    return <Square key={i} squareData={squareData}/>
                })}
            </div>
        </div>
    </div>
}

 export default Editor;