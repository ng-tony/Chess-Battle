import { useDispatch } from "react-redux";
import { undo } from "../../actions";

const Undo = () => {
    const dispatch =  useDispatch();
    const onClick:React.MouseEventHandler<HTMLElement> = (e) =>{
        dispatch(undo())
    }
    return (
        <button className="undo btn" onClick={onClick}>
            <div className="btn-img"></div>
        </button>
    )
}

export default Undo;
