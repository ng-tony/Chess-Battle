import React from "react";
import Square from "./Square";
import {decodePiece} from '../piece'

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
        <div className="editor-row">
            {whitePieces.map((piece, i) => {
                return <Square piece={piece}/>
            })}
        </div>
        <div className="editor-row">
            {blackPieces.map((piece, i) => {
                return <Square piece={piece}/>
            })}
        </div>
    </div>
}

 export default Editor;