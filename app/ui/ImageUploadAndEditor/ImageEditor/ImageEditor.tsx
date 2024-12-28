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

    useDrawingCommands(canvasRefPerm, drawCommands);

    useDrawingTool(canvasRefPerm, canvasRefTemp, activeTool, canvasWidth, canvasHeight, drawCommands, addDrawingCommand, textInputStateSetter, textInputState);

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