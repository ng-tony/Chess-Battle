import React from "react";
import Square, {SquareData} from "./Square";
import {PowerUpType} from "../GameLogic"

const PowerUpEditor =  () => {
    const powerUps = [
        {type: PowerUpType.Guard}, {type: PowerUpType.Shield},
        {type: PowerUpType.Sword}, {type: PowerUpType.Flail},
    ]
    return <div className="powerup-editor">
        <div className="container">
            <div className="row">
                {powerUps.map((powerUp, i) => {
                    let squareData : SquareData = {
                        powerUp,
                    }
                    return <Square squareData={squareData}/>
                })}
            </div>
        </div>
    </div>
}

 export default PowerUpEditor;