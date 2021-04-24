import React from "react";
import Square, {SquareData} from "./Square";
import {PowerUpType, PowerUpData} from "../GameLogic"

const PowerUpEditor =  () => {
    const powerUps:PowerUpData[] = []

    for(const pupType in PowerUpType)
        powerUps.push({type: pupType} as PowerUpData)
    
    return <div className="powerup-editor">
        <div className="container">
            <div className="row">
                {powerUps.map((powerUp, i) => {
                    let squareData : SquareData = {
                        powerUp,
                    }
                    return <Square key={i} squareData={squareData}/>
                })}
            </div>
        </div>
    </div>
}

 export default PowerUpEditor;