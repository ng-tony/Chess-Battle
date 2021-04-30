import './App.scss'
import VisibleBoard from './containers/VisibleBoard'
import Editor from './components/Editor'
import PowerUpEditor from './components/PowerUpEditor'
import UnReDoer from './containers/UnReDoer'
import ButtonBar from './components/ButtonBar'
import History from './components/History'
import SoundMaker from './containers/SoundMaker'

function App() {
    return (
        <div className="App">
            <div className="container">
                <div className="left">
                    <VisibleBoard />
                    <ButtonBar />
                </div>

                <div className="tools right">
                    <div className="editors">
                        <Editor />
                        <PowerUpEditor />
                    </div>
                    <History />
                </div>
                <UnReDoer />
                <SoundMaker />
            </div>
        </div>
    )
}

export default App
