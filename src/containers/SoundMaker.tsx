import { useEffect, useRef } from "react";
import { connect } from "react-redux";
import PieceData from "../GameLogic";
import {sounds} from '../assets/sounds/index'

type SoundMakerProps = {
    squares: (PieceData | null)[],
}


const moveAudio = new Audio(sounds.move.default);
const powerUpAudio = new Audio(sounds.move.default);
const captureAudio = new Audio(sounds.capture.default);
const addedPieceAudio = new Audio(sounds.capture.default);

const SoundMaker: React.FC<SoundMakerProps> = ({squares}) => {
    const prevSquaresRef = useRef<(PieceData | null)[]>([]);
    const prevNumEmptySquaresRef = useRef<number>(0);
    useEffect(() => {
        prevSquaresRef.current = squares;
        prevNumEmptySquaresRef.current = numEmptySquares;
    })
    const prevSquares = prevSquaresRef.current;
    const prevNumEmptySquares = prevNumEmptySquaresRef.current;
    const numEmptySquares = squares.reduce((acc, val) => {
        if (val === null) acc++
        return acc;
    }, 0)

    if (prevNumEmptySquares < numEmptySquares) {
        captureAudio.play();
    } else if (prevNumEmptySquares > numEmptySquares){
        addedPieceAudio.play();
    }

    let pieceMoved = false; 
    for (let [i, square] of squares.entries()){
        if (square === null) continue;
        console.log(i, square)
        if (prevSquares[i] === null) {
            pieceMoved = true;
            break;
        }
    }
    if(pieceMoved) {
        moveAudio.play()
    } else {
        // powerUpAudio.play()
    }
    return  null;
}

const mapState = ((state: { board: { present: any; }; }) => {
    return {squares: state.board.present}
})

export default connect (mapState)(SoundMaker);