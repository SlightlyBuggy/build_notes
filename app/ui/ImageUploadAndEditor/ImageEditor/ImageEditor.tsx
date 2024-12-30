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
import { TextInputState} from "./TextInput";
import { selectionIsInObject } from "@/app/lib/util/selectorDrawingTool";




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

    const [textInputState, setTextInputState] = useState<TextInputState>({active: false, posX: 0, posY: 0, value: ''})

    const [mouseLastCoords, setMouseLastCoords] = useState<{lastX: number, lastY: number}>()
    const [dragInProgress, setDragInProgress] = useState<boolean>(false)

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
            setTextInputState({...textInputState, active: false})
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

    const textInputStateSetter = (newTextInputState: TextInputState) => {

        // if the input is active and we click around, don't do anything, otherwise
        // the input would move to wherever we click.  later we want to 'commit' the text by
        // clicking outside the text field
        if(textInputState.active && newTextInputState.active)
        {
            return
        }

        setTextInputState(newTextInputState)
    }

    const textInputValueSetter = (value: string) => {
        setTextInputState({...textInputState, value: value})
    }

    // later consider moving this into the useDrawingTool hook?
    const selectOnCanvas = (posX: number, posY: number) => {
        const drawCommandsCopy = [...drawCommands]
        for(let command of drawCommandsCopy) {

            const commandSelected = selectionIsInObject(command, posX, posY)
            
            if(commandSelected)
            {
                setMouseLastCoords({lastX: posX, lastY: posY})
                setDragInProgress(true)
                command.selected = true
                setDrawCommands(drawCommandsCopy)
                break

            } else {
                console.log(`Selection is not in a command`)
            }
        }
    }

    const handleDragOnCanvas = (posX: number, posY: number) => {
        if(mouseLastCoords)
        {
            const deltaX = posX - mouseLastCoords.lastX
            const deltaY = posY - mouseLastCoords.lastY

            //TODO: optimize by storing array ID of thing being dragged in state
            const drawCommandsCopy = [...drawCommands]
            for(let command of drawCommandsCopy)
            {
                if(command.selected)
                {
                    command.startX += deltaX
                    command.startY += deltaY
                    if(command.endX)
                    {
                        command.endX += deltaX
                    }
                    if(command.endY)
                    {
                        command.endY += deltaY
                    }
                    setMouseLastCoords({lastX: posX, lastY: posY})
                    setDrawCommands(drawCommandsCopy)
                    break
                }
            }
        }
    }

    const unSelectOnCanvas = () => {
        const drawCommandsCopy = [...drawCommands]
        for(let command of drawCommandsCopy)
        {
            if(command.selected)
            {
                command.selected = false
                break
            }
        }
        setDragInProgress(false)
        setDrawCommands(drawCommandsCopy)
    }

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
            />
            <SaveDrawingButton saveImage={() => saveImage(canvasRefPerm)} />
        </div>
        )
}