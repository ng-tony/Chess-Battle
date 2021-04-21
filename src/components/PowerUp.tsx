import {powerUpImages, powerUpImageKey} from '../img/index'
import {PowerUpData} from '../GameLogic'
import { DropInfoType } from './Board'
import React from 'react';


const PowerUp = ({powerUp}: {
    powerUp:PowerUpData,
}) => {
    const powerUpDrag = (ev:React.DragEvent) => {
        let dropInfo = {
            type: DropInfoType.addPowerUp,
            powerUp: powerUp,
        }
        ev?.dataTransfer?.setData("dropInfo", JSON.stringify(dropInfo));
    }
    return (
        <div>
        <img className="powerUp"
            draggable={true}
            onDragStart={powerUpDrag}
            src={powerUpImages[powerUp.type as powerUpImageKey]}
            alt={powerUp.type.toString()}
        />
        </div>
        )
}

export default PowerUp;
