import { connect } from 'react-redux'
import { movePiece, editSquare, addPower, removePowers, selectSquare } from '../actions'
import Board from '../components/Board'
import { SquareData } from '../components/BuildingBlocks/Square'
import PieceData, {PowerUpData} from '../GameLogic'
import { gameInfo } from '../reducers/gameInfo'

const mapStateToProps = (state:{board: {
  present: {squares: (PieceData | null)[]}
}, gameInfo: gameInfo
}) => {
  return {
    squares: state.board.present.squares,
    selectedSquare: state.gameInfo.selectedSquare,
    lastMove: state.gameInfo.lastMove,
    flipped: state.gameInfo.flippedBoard,
  }
}

const mapDispatchToProps = (dispatch:(action:any) => void)  => ({
  movePiece: (from:number, to:number) => dispatch(movePiece(from, to)),
  editSquare: (loc:number, piece:PieceData) => dispatch(editSquare(loc, piece)),
  addPower: (loc:number, powerUp: PowerUpData) => dispatch(addPower(loc, powerUp)),
  removePower:(loc:number) => dispatch(removePowers(loc)),
  selectSquare:(squareData:SquareData) => dispatch(selectSquare(squareData)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Board)
