'use client'
import { StaticImageData } from "next/image";
import React, { useRef, useState } from "react"
import { DrawingTool } from "@/app/lib/util/enums";
import { useDrawingTool } from "@/app/lib/hooks/useDrawingTools";
import ImageAndCanvases from "./ImageAndCanvases";
import DrawingToolPalette from "./DrawingToolPalette";
import SaveDrawingButton from "./SaveDrawingButton";
import { DrawingCommand } from "@/app/lib/util/types";
import { useDrawingCommands } from "@/app/lib/hooks/useDrawingCommands";
import { saveImage } from "@/app/lib/util/image";
import { useTextInput } from "@/app/lib/hooks/useTextInput";
import { useSelectionOnCanvas } from "@/app/lib/hooks/useSelectionOnCanvas";




export default function ImageEditor({
    imageData
}: {
    imageData: StaticImageData
}) {

    const canvasRefPerm = useRef<HTMLCanvasElement>(null);
    const canvasRefTemp = useRef<HTMLCanvasElement>(null);

    const [activeTool, setActiveTool] = useState<null|DrawingTool>(null);

    const [drawCommands, setDrawCommands] = useState<DrawingCommand[]>([])
    const [undoneDrawCommands, setUndoneDrawCommands] = useState<DrawingCommand[]>([])
    
    const drawCommandsSetter = (commands: DrawingCommand[]) => {
        setDrawCommands(commands)
    }

    const { textInputStateSetter, textInputValueSetter, textInputSizeSetter, textInputState } = useTextInput()


    const handleToolClick = (tool: DrawingTool) => {
        // only switch tools if we've clicked a different one
        if(tool === activeTool)
        {
            return
        }

        setActiveTool(tool);

        // made sure the text input is not visible
        if(textInputState.active)
        {
            textInputStateSetter({...textInputState, active: false})
        }
    }

    const canvasHeight = imageData.height;
    const canvasWidth = imageData.width;

    const addDrawingCommand = (command: DrawingCommand) => {
        setDrawCommands([...drawCommands, command])
        // when a new command is added, we clear the list of undone commands.  otherwise things could get confusing for the user.
        setUndoneDrawCommands([])
    }

    const undoLastDrawingCommand = () => {
        const currentCommands = [...drawCommands]
        const lastCommand : DrawingCommand | undefined = currentCommands.pop()
        if(lastCommand)
        {
            setUndoneDrawCommands([...undoneDrawCommands, lastCommand])
            setDrawCommands(currentCommands)
        }
    }

    const redoLastUndoneCommand = () => {
        const currentUndoneCommands = [...undoneDrawCommands]
        const commandToRedo = currentUndoneCommands.pop()
        if(commandToRedo)
        {
            setDrawCommands([...drawCommands, commandToRedo])
            setUndoneDrawCommands(currentUndoneCommands)
        }
    }

    const {selectOnCanvas, handleDragOnCanvas, unSelectOnCanvas, dragInProgress} = useSelectionOnCanvas({drawCommands: drawCommands, drawCommandsSetter: drawCommandsSetter})

    useDrawingCommands(canvasRefPerm, drawCommands);

    useDrawingTool(canvasRefPerm, canvasRefTemp, activeTool, 
        canvasWidth, canvasHeight, drawCommands, addDrawingCommand, 
        textInputStateSetter, textInputState, selectOnCanvas,
    dragInProgress, handleDragOnCanvas, unSelectOnCanvas);

    return (
        <div data-testid='image-editor'>
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