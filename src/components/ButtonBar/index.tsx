
import { connect } from 'react-redux';
import { flipBoard, redo, toggleAbout, undo } from '../../actions';
import './ButtonBar.scss'
import Butt from './Butt';
import AboutModal from './AboutModal'

type ButtonBarProps = {
    aboutShow: boolean,
    toggleAbout: () => void,
    redo: () => void,
    undo: () => void,
    flipBoard: () => void,
}

const ButtonBar:React.FC<ButtonBarProps> = ({aboutShow, toggleAbout, redo, undo, flipBoard}) => {
    return (
        <div className="button-bar container">
            <Butt btnClass="undo" onClick={undo} />
            <Butt btnClass="redo" onClick={redo} />
            <Butt btnClass="about" onClick={toggleAbout} />
            <Butt btnClass="flip" onClick={flipBoard} />
            <AboutModal show={aboutShow} toggle={toggleAbout}/>
        </div>
    )
}


const mapStateToProps = (state: {
    gameInfo: {about:boolean}
}) => {
    return {
        aboutShow: state.gameInfo.about
    }
}

const mapDispatchToProps = (dispatch: (action: any) => void) => ({
    toggleAbout: () => dispatch(toggleAbout()),
    redo: () => dispatch(redo()),
    undo: () => dispatch(undo()),
    flipBoard: () => dispatch(flipBoard()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ButtonBar)

