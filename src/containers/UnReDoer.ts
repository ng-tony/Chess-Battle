import { useEffect } from 'react'
import { connect } from 'react-redux'
import { undo, redo } from '../actions'

const UnReDoer = ({undoL, redoL}: {undoL: ()=>void, redoL:()=>void}) => {

    useEffect(() => {
        document.addEventListener("keydown", (event) => {
            console.log(event.code);
            console.log("wtf")
            switch (event.code){
                case "ArrowLeft":
                    undoL();
                    break;
                case "ArrowRight":
                    redoL();
                    break;
                default:
                    break;
            }
        })
    })
    return null;
}

const mapDispatchToProps = (dispatch:(action:any) => void)  => ({
undoL: () => dispatch(undo()),
redoL: () => dispatch(redo()),
})

export default connect(
    undefined,
    mapDispatchToProps
  )(UnReDoer)
  