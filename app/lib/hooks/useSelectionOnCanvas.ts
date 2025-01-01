import { useState } from "react"
import { DrawingCommand } from "../util/types"
import { selectionIsInObject } from "../util/selectorDrawingTool"

export const useSelectionOnCanvas = (
    {
        drawCommands,
        drawCommandsSetter
    }:{
        drawCommands: DrawingCommand[],
        drawCommandsSetter: (commands: DrawingCommand[]) => void
    }
) => {

    const [mouseLastCoords, setMouseLastCoords] = useState<{lastX: number, lastY: number}>()
    const [dragInProgress, setDragInProgress] = useState<boolean>(false)
    
    const selectOnCanvas = (posX: number, posY: number) => {
        const drawCommandsCopy = [...drawCommands]
        for(let command of drawCommandsCopy) {

            const commandSelected = selectionIsInObject(command, posX, posY)
            
            if(commandSelected)
            {
                setMouseLastCoords({lastX: posX, lastY: posY})
                setDragInProgress(true)
                command.selected = true
                drawCommandsSetter(drawCommandsCopy)
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
                    if(command.objectBoundaries)
                    {
                        command.objectBoundaries.leftX += deltaX
                        command.objectBoundaries.rightX += deltaX

                        command.objectBoundaries.bottomY += deltaY
                        command.objectBoundaries.topY += deltaY
                    }
                    setMouseLastCoords({lastX: posX, lastY: posY})
                    drawCommandsSetter(drawCommandsCopy)
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
        drawCommandsSetter(drawCommandsCopy)
    }

    return {selectOnCanvas, handleDragOnCanvas, unSelectOnCanvas, dragInProgress}
}