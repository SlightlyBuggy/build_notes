'use client'
import { StaticImageData } from "next/image";
import React from "react"

import PermAndTempCanvases from "./PermAndTempCanvases";


export default function ImageAndCanvases({
    imageData,
    canvasHeight,
    canvasWidth,
    canvasRefPerm,
    canvasRefTemp
}: {
    imageData: StaticImageData,
    canvasHeight: number,
    canvasWidth: number,
    canvasRefPerm: React.RefObject<HTMLCanvasElement>,
    canvasRefTemp: React.RefObject<HTMLCanvasElement>
}) {

    return (
        <div>
            <img src={imageData.src} className="absolute"/>
            <PermAndTempCanvases canvasHeight={canvasHeight} canvasWidth={canvasWidth} canvasRefPerm={canvasRefPerm} canvasRefTemp={canvasRefTemp}/>
        </div>
        )
}