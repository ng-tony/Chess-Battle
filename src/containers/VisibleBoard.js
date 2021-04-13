import { connect } from 'react-redux'
import { movePiece } from '../actions'
import Board from '../components/Board'

const mapStateToProps = state => ({
  squares: state.board
})

const mapDispatchToProps = dispatch => ({
  movePiece: (from, to) => dispatch(movePiece(from, to))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Board)
