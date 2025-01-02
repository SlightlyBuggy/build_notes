'use client'
import { StaticImageData } from "next/image";
import React, { useRef } from "react"
import { useDrawingTool } from "@/app/lib/hooks/useDrawingTools";
import ImageAndCanvases from "./ImageAndCanvases";
import DrawingToolPalette from "./DrawingToolPalette/DrawingToolPalette";
import SaveDrawingButton from "./SaveDrawingButton";
import { useDrawingCommands } from "@/app/lib/hooks/useDrawingCommands";
import { saveImage } from "@/app/lib/util/image";
import { useToolPalette } from "@/app/lib/hooks/useToolPalette";

export default function ImageEditor({
    imageData
}: {
    imageData: StaticImageData
}) {

    const canvasRefPerm = useRef<HTMLCanvasElement>(null);
    const canvasRefTemp = useRef<HTMLCanvasElement>(null);

    const canvasHeight = imageData.height;
    const canvasWidth = imageData.width;

    const {handleToolClick, activeTool} = useToolPalette()

    const {drawCommands, undoneDrawCommands, addDrawingCommand, drawCommandsSetter, undoLastDrawingCommand, redoLastUndoneCommand} = useDrawingCommands(canvasRefPerm);

    const {textInputState, textInputValueSetter, textInputSizeSetter} = useDrawingTool(canvasRefPerm, canvasRefTemp, activeTool, 
        canvasWidth, canvasHeight, drawCommands, addDrawingCommand, drawCommandsSetter);

    return (
        <div data-testid='image-editor' className="relative z-1">
            <DrawingToolPalette 
                activeTool={activeTool} 
                handleToolClick={handleToolClick} 
                undoLastDrawingCommand={undoLastDrawingCommand} 
                drawingCommands={drawCommands}
                redoLastUndoneCommand={redoLastUndoneCommand}
                undoneDrawCommands={undoneDrawCommands}
            />
            <ImageAndCanvases 
                imageData={imageData} 
                canvasHeight={canvasHeight} 
                canvasWidth={canvasWidth} 
                canvasRefPerm={canvasRefPerm} 
                canvasRefTemp={canvasRefTemp}
                textInputState={textInputState}
                textInputValueSetter={textInputValueSetter}
                textInputSizeSetter={textInputSizeSetter}
            />
            <SaveDrawingButton saveImage={() => saveImage(canvasRefPerm)} />
        </div>
        )
}