import React from 'react'
import { useDispatch } from 'react-redux'
import { redo } from '../../actions';

const Redo = () => {
    const dispatch =  useDispatch();
    const onClick:React.MouseEventHandler<HTMLElement> = (e) =>{
        dispatch(redo())
    }
    return (
        <button className="redo btn" onClick={onClick}>
            <div className="btn-img"></div>
        </button>
    )
}

export default Redo;
