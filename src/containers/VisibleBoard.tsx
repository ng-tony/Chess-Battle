import { connect } from 'react-redux'
import { movePiece, editSquare, addPower, removePowers } from '../actions'
import Board from '../components/Board'
import PieceData, {PowerUpData} from '../GameLogic'

const mapStateToProps = (state:{board:PieceData[]}) => ({
  squares: state.board
})

const mapDispatchToProps = (dispatch:(action:any) => void)  => ({
  movePiece: (from:number, to:number) => dispatch(movePiece(from, to)),
  editSquare: (loc:number, piece:PieceData) => dispatch(editSquare(loc, piece)),
  addPower: (loc:number, powerUp: PowerUpData) => dispatch(addPower(loc, powerUp)),
  removePower:(loc:number) => dispatch(removePowers(loc)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Board)

connect()