'use client'
import { StaticImageData } from "next/image";
import React from "react"

import PermAndTempCanvases from "./PermAndTempCanvases";
import { TextInputState } from "./TextInput";


export default function ImageAndCanvases({
    imageData,
    canvasHeight,
    canvasWidth,
    canvasRefPerm,
    canvasRefTemp,
    textInputState,
    textInputValueSetter
}: {
    imageData: StaticImageData,
    canvasHeight: number,
    canvasWidth: number,
    canvasRefPerm: React.RefObject<HTMLCanvasElement>,
    canvasRefTemp: React.RefObject<HTMLCanvasElement>,
    textInputState: TextInputState,
    textInputValueSetter: (value: string) => void
}) {

    return (
        <div>
            <img src={imageData.src} className="absolute"/>
            <PermAndTempCanvases 
                canvasHeight={canvasHeight} 
                canvasWidth={canvasWidth} 
                canvasRefPerm={canvasRefPerm} 
                canvasRefTemp={canvasRefTemp} 
                textInputState={textInputState}
                textInputValueSetter={textInputValueSetter}
                />
        </div>
        )
}