import { connect } from 'react-redux'
import { movePiece, editSquare } from '../actions'
import Board from '../components/Board'
import Piece from '../piece'

const mapStateToProps = (state:{board:Piece[]}) => ({
  squares: state.board
})

const mapDispatchToProps = (dispatch:(action:any)=>void)  => ({
  movePiece: (from:number, to:number) => dispatch(movePiece(from, to)),
  editSquare: (loc:number, piece:Piece) => dispatch(editSquare(loc, piece))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Board)

connect()