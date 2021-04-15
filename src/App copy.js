import bK from './bK.svg'
import './App.css';
import {useSelector, useDispatch} from 'react-redux';
import {edit} from './actions';
import EditBoard from './containers/EditBoard'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

class Square extends Component {
  render() {
    return(
    <div className="square"
     onDragOver={(ev) => ev.preventDefault(ev)}
     onDrop={this.props.squareDrop}
     id={this.props.sqId}
    >
      {this.props.sqId}
      {this.props.piece}
    </div>
  );
  }
}

Square.propTypes = {
  onDrop: PropTypes.func.isRequired,
  id: PropTypes.string,
  piece: PropTypes.object
}

function Piece(props){
  return (
      <img className="piece"
      draggable="true"
      onDragStart={props.pieceDrag}
      //src={props.src}
      alt={props.id}
      id={props.id}
      //onDrop={(ev) => (false)}
      //onDragOver={(ev) => (false)}
      />
  )
}

class Board extends Component {
  makePiece(i, j){
    const pId = "p" + (i*8 + j);
    return (
      <Piece
        value={this.props.squares[i*8 + j]}
        pieceDrag={this.props.pieceDrag(pId)}
        src={bK}
        alt="BK"
        id={pId}
      />
    )
  }
  render() {
    return (
      <div>
       <p>test2</p>
        {Array(8).fill().map((_, i) => {
          return (
            <div className="board-row" key={i}>
              {Array(8).fill().map((_, j) => {
                const sqId = "sq" + (i*8 + j);
                return (
                        <Square
                        sqId={sqId}
                        key={sqId}
                        value={this.props.squares[i*8 + j]}
                        squareDrop={this.props.squareDrop(sqId)}
                        pieces={[this.makePiece(i, j)]}
                        />
                        )
              })}
            </div>
          )
        })}
      </div>
    );
  }
}


function App() {
  const dispatch = useDispatch();
  const board = useSelector(state => state.board);
  const squares = Array(64).fill().map((_, i) => i);
  
  const pieceDrag = (pId) => {
    return (ev) => {
      ev.dataTransfer.setData("id", pId);
      return;
    }
  }
  const squareDrop = (sqId) => {
    return (ev) => {
      ev.preventDefault();
      var data = ev.dataTransfer.getData("id");
      //document.getElementById(sqId).appendChild(document.getElementById(data));
      ReactDOM.render(<Piece/>, document.getElementById(sqId))
      console.log(sqId)
      return;
    }
  }
  return (
    <div className="App">
      <Board onClick={i => this.handleClick(i)}
       squares={squares} 
       pieceDrag={pieceDrag}
       squareDrop={squareDrop}
       on
       />
      <h1>Board: {board}</h1>
      <EditBoard />
      <button onClick={() => dispatch(edit(1, 'k'))}>Button Wow</button>
    </div>
  );
}

export default App;
