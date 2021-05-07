import { connect } from 'react-redux'
import { jumpToHistory, selectSquare } from '../actions';
import { NULL_SQUARE } from './BuildingBlocks/Square';
import './History.scss'
import React from 'react';

type HistoryItem = {move: string};
type HistoryProps = {
    state: {past: HistoryItem[], present: HistoryItem, future: HistoryItem[]}
    jumpToHistory: (step: number) => void
    clearSelected: () => void;
}


const History:React.FC<HistoryProps> = ({state:{past, present, future}, jumpToHistory, clearSelected}) => {
    const current = past.length;

    const makeOnClickHandler = (i: number) => {
        return (ev: React.MouseEvent) => {
            jumpToHistory(i);
            clearSelected();
        }
    }
    const fullHistory = past.concat([present]).concat(future);
    const fullHistoryJSX = fullHistory.map((historyItem, i) => {
        return <div className="row-item btn unselectable">
                    <p>{historyItem.move}</p>
                </div>
    })
    const historyContents = []
    for (let i = 1; i < fullHistoryJSX.length; i=i+2) {
        historyContents.push(
            <div className="row">
                <div className="row-item move-number"><p>{((i-1)/2) + 1}</p></div>
                <div 
                    className={"row-item btn unselectable" + ((current===i) ? " selected" : "")}
                    onClick = {makeOnClickHandler(i)}
                >
                    <p>{fullHistoryJSX[i]}</p>
                </div>
                { fullHistoryJSX.length > i+1 ?
                <div
                    className={"row-item btn unselectable" + ((current===i+1) ? " selected" : "")}
                    onClick = {makeOnClickHandler(i+1)}
                >
                    <p>{fullHistoryJSX[i+1]}</p>
                </div> : <div className="row-item"></div>
                }
            </div>
        )
    }
    console.log(fullHistory)
    return (
        <div className="history">
            {historyContents}
        </div>
        )
}

const mapState = ((state:any) => {
    return {state: state.board}
})

const mapDispatchToProps = (dispatch: (action: any) => void) => ({
    jumpToHistory: (step: number) => dispatch(jumpToHistory(step)),
    clearSelected: () => dispatch(selectSquare(NULL_SQUARE))
})
export default connect (mapState, mapDispatchToProps)(History);

