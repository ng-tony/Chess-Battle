import './Editor.scss'
import React from "react";
import Square, {SquareData} from "./BuildingBlocks/Square";
import PieceData, {decodePiece} from '../GameLogic'
import { editSquare, selectSquare } from '../actions';
import { DropInfo } from './Board';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';


type EditorProps = {
    selectedSquare: SquareData
    editSquare: (loc: number, piece: PieceData) => void
    selectSquare: (squareData: SquareData) => void
}

const Editor:React.FC<EditorProps> =  ({selectedSquare, editSquare, selectSquare}) => {
    const onClickHandlerHandlerFactory = (squareData:SquareData) => {
        return (ev: React.MouseEvent) => {
            selectSquare(squareData);
        }
    }
    
    const onDropHandlerFactory = () => {
        return (ev: React.DragEvent) => {
            ev.preventDefault();
            let dropInfo = JSON.parse(ev.dataTransfer.getData('dropInfo')) as DropInfo;
            if (dropInfo.id) editSquare(dropInfo.id, decodePiece("bz")) //remove piece
        }
    }
    
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
                        highlighted: false,
                        lastMove: false,
                        selected: isEqual(selectedSquare.piece, piece) && selectedSquare.id === undefined,
                    }
                    return <Square
                                key={i}
                                squareData={squareData}
                                onClick={onClickHandlerHandlerFactory(squareData)}
                                onDrop={onDropHandlerFactory()}
                            />
                })}
            </div>
            <div className="row">
                {blackPieces.map((piece, i) => {
                    let squareData : SquareData = {
                        piece,
                        highlighted: false,
                        lastMove: false,
                        selected: isEqual(selectedSquare.piece, piece) && selectedSquare.id === undefined,
                    }
                    return <Square
                                key={i}
                                squareData={squareData}
                                onClick={onClickHandlerHandlerFactory(squareData)}
                                onDrop={onDropHandlerFactory()}
                            />
                })}
            </div>
        </div>
    </div>
}

const mapStateToProps = (state: { gameInfo: { selectedSquare: any; }; }) => {
    return {
        selectedSquare: state.gameInfo.selectedSquare,
    }
}

const mapDispatchToProps = (dispatch:(action:any) => void)  => ({
    editSquare: (loc:number, piece:PieceData) => dispatch(editSquare(loc, piece)),
    selectSquare:(squareData:SquareData) => dispatch(selectSquare(squareData)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Editor)