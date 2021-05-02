import './PowerUpEditor.scss'
import Square, {SquareData} from "./BuildingBlocks/Square";
import PieceData, {PowerUpType, PowerUpData, decodePiece} from "../GameLogic"
import { editSquare, selectSquare } from '../actions';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import { DropInfo } from './Board';

type PowerUpEditorProps = {
    selectedSquare: SquareData
    editSquare: (loc: number, piece: PieceData) => void
    selectSquare: (squareData: SquareData) => void
}


const PowerUpEditor:React.FC<PowerUpEditorProps> =  ({selectedSquare, editSquare, selectSquare}) => {
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
    const powerUps:PowerUpData[] = []

    for(const pupType in PowerUpType)
        powerUps.push({type: pupType} as PowerUpData)
    
    return <div className="powerup-editor">
        <div className="container">
            <div className="row">
                {powerUps.map((powerUp, i) => {
                    let squareData : SquareData = {
                        powerUp,
                        highlighted: false,
                        lastMove: false,
                        selected: isEqual(selectedSquare.powerUp, powerUp) &&  selectedSquare.id === undefined,
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

export default connect(mapStateToProps, mapDispatchToProps)(PowerUpEditor)