
import './App.css';
import {useSelector, useDispatch} from 'react-redux';
import {edit} from './actions';
import EditBoard from './containers/EditBoard'
import VisibleBoard from './containers/VisibleBoard'

function App() {
  const dispatch = useDispatch();
  const board = useSelector(state => state.board);

  return (
    <div className="App">
      <VisibleBoard />
      <EditBoard />
      <button onClick={() => dispatch(edit(1, 'k'))}>Button Wow</button>
    </div>
  );
}

export default App;
