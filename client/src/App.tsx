import './App.scss'
import { useEffect } from 'react'
import VisibleBoard from './containers/VisibleBoard'
import Editor from './components/Editor'
import PowerUpEditor from './components/PowerUpEditor'
import UnReDoer from './containers/UnReDoer'
import ButtonBar from './components/ButtonBar'
import History from './components/History'
import SoundMaker from './containers/SoundMaker'
import { applyHistory, consolidateMove, } from './actions'
import { connect } from 'react-redux'

export const ws = new WebSocket('ws://localhost:3001')
export type ServerMessage = {
    type:string,
    moveNumber: number,
    jump?:number,
    action?: any,
    gameCode?: string,
    history?: any[],
}

type AppProps = {
    handleMove: (serverMessage: ServerMessage) => void
    handleHistory:(serverMessage: ServerMessage) => void
}

const App:React.FC<AppProps> = ({handleMove, handleHistory}) => {
    useEffect( () => {
        const query = new URLSearchParams(window.location.search);
        let gameCode = query.get("game")
        ws.onopen = () => {
            console.log("Connected To Server")
            if (gameCode) {
                ws.send(JSON.stringify({type:"join", gameCode}))
            }
        }

        ws.onmessage = (event) => {
            //const message = JSON.parse(event.data)
            const serverMessage = JSON.parse(event.data) as ServerMessage;
            switch(serverMessage.type){
                case "join":
                    //Copy all history
                    handleHistory(serverMessage);
                    break;
                case "move":
                    handleMove(serverMessage)
                    break;
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
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

const mapDispatchToProps = (dispatch:(action:any) => void)  => ({
    handleMove: (message: ServerMessage) => dispatch(consolidateMove(message)),
    handleHistory: (message: ServerMessage) => dispatch(applyHistory(message)),
  })
  

export default connect(undefined, mapDispatchToProps)(App)
