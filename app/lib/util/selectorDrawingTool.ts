import { DrawingTool } from "./enums";
import { DrawingCommand, ObjectBoundaries } from "./types";



export const getObjectBoundaries = (toolType: DrawingTool, startX: number, startY: number, endX?: number, endY?: number) : ObjectBoundaries => {
    switch (toolType) {

        case(DrawingTool.Line):
            if(endX && endY)
            {
                const leftX = Math.min(startX, endX)
                const rightX = Math.max(startX, endX)
                const topY = Math.min(startY, endY)
                const bottomY = Math.max(startY, endY)

                return {
                    leftX: leftX,
                    rightX: rightX,
                    topY: topY,
                    bottomY: bottomY
                }
            }
        default:
            throw Error(`getObjectBoundaries does not handle object type ${toolType}`)
    }
}

export const selectionIsInObject = (command: DrawingCommand, posX: number, posY: number) =>
{
    if(command.objectBoundaries)
    {
        const boundaries = command.objectBoundaries
        return posX >= boundaries.leftX && posX <= boundaries.rightX && 
            posY >= boundaries.topY && posY <= boundaries.bottomY
    }
}