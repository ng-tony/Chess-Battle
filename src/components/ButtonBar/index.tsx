import About from './About'
import './ButtonBar.scss'
import Redo from './Redo';
import Undo from './Undo';
const ButtonBar = () => {
    return (
        <div className="button-bar container">
            <Undo />
            <Redo />
            <About />
        </div>
    )
}

export default ButtonBar;
