
import { connect } from 'react-redux';
import { toggleAbout } from '../../actions';
import About from './About'
import './ButtonBar.scss'
import Redo from './Redo';
import Undo from './Undo';
import AboutModal from './AboutModal'

type ButtonBarProps = {
    aboutShow: boolean,
    toggleAbout: () => void,
}

const ButtonBar:React.FC<ButtonBarProps> = ({aboutShow, toggleAbout}) => {
    return (
        <div className="button-bar container">
            <Undo />
            <Redo />
            <About toggle={toggleAbout}/>
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
    toggleAbout: () => dispatch(toggleAbout())
})

export default connect(mapStateToProps, mapDispatchToProps)(ButtonBar)

