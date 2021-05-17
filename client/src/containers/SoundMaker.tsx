import { useEffect, useRef } from "react";
import { connect } from "react-redux";
import PieceData from "../GameLogic";
import {sounds} from '../assets/sounds/index'

type SoundMakerProps = {
    squares: (PieceData | null)[],
}


const moveAudio = new Audio(sounds.move.default);
const powerUpAudio = new Audio(sounds.power.default);
const captureAudio = new Audio(sounds.capture.default);
const addedPieceAudio = new Audio(sounds.add.default);

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

    const capture = prevNumEmptySquares < numEmptySquares;
    const pieceAdded = prevNumEmptySquares > numEmptySquares;

    let pieceMoved = false; 
    for (let [i, square] of squares.entries()){
        if (square === null) continue;
        if (prevSquares[i] === null) {
            pieceMoved = true;
            break;
        }
    }
    if (capture) {
        moveAudio.play().catch(error => {/*meh*/});
        captureAudio.play().catch(error => {/*meh*/});;
    } else if (pieceAdded) {
        addedPieceAudio.play().catch(error => {/*meh*/});
    } else if (pieceMoved) {
        moveAudio.play().catch(error => {/*meh*/});
    } else { //Board edited i.e powerup
        powerUpAudio.play().catch(error => {/*meh*/});
    }
    return  null;
}

const mapState = ((state: { board: { present: any; }; }) => {
    return {squares: state.board.present.squares}
})

export default connect (mapState)(SoundMaker);