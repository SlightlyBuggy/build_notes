import { DrawingTool } from "@/app/lib/util/enums";
import { StartingCoords, LastCoords, DrawingCommand } from "@/app/lib/util/types";
import { mouseUpLineTool, mouseDownLineTool, mouseMoveLineTool } from "./lineToolActions";
import { mouseUpRadiusedCircleTool, mouseMoveRadiusedCircleTool, mouseDownRadiusedCircleTool } from "./radiusedCircleToolActions"
import { mouseDownCircleTool } from "./circleToolActions";
import { mouseDownSquareTool } from "./squareToolActions";

// TODO: this could be handled by polymorphism

export const mouseDownAction = (mouseDownEvent: MouseEvent, rect: DOMRect, tool: DrawingTool | null, 
    contextPerm: CanvasRenderingContext2D, paintingSetter: (paintingVal: boolean) => void, startingCoordsSetter: (coords: StartingCoords) => void, addDrawingCommand: (command: DrawingCommand) => void
) : void => {

    const currentX = mouseDownEvent.clientX - rect.left;
    const currentY = mouseDownEvent.clientY - rect.top;
    switch(tool)
    {
        case DrawingTool.Circle:
            mouseDownCircleTool(currentX, currentY, contextPerm, addDrawingCommand)
            return;
        case DrawingTool.Square:
            mouseDownSquareTool(currentX, currentY, contextPerm, addDrawingCommand)
            return;
        case DrawingTool.Line:
            mouseDownLineTool(currentX, currentY, paintingSetter, startingCoordsSetter)
            return;
        case DrawingTool.RadiusedCircle:
            mouseDownRadiusedCircleTool(currentX, currentY, paintingSetter, startingCoordsSetter)
            return;
        default:
            console.log(`mouse down action not implemented for tool type ${tool}`)
    }
}

export const mouseUpAction = (tool: DrawingTool | null, contextPerm: CanvasRenderingContext2D, contextTemp: CanvasRenderingContext2D, 
    startingCoords: StartingCoords | null, lastCoords: LastCoords | null, paintingSetter: (paintingVal: boolean) => void, startingCoordsSetter: (startingCoords: StartingCoords | null) => void, lastCoordsSetter: (coords: LastCoords | null) => void, canvasWidth: number, canvasHeight: number, addDrawingCommand: (command: DrawingCommand) => void) => {
    switch(tool)
    {
        case DrawingTool.Line:
            if(startingCoords && lastCoords)
            {
                mouseUpLineTool(contextPerm, contextTemp, startingCoords, lastCoords, paintingSetter, startingCoordsSetter, lastCoordsSetter, canvasWidth, canvasHeight, addDrawingCommand)
            }
            return;
        case DrawingTool.RadiusedCircle:
            if(startingCoords && lastCoords)
            {
                mouseUpRadiusedCircleTool(contextPerm, contextTemp, startingCoords, lastCoords, paintingSetter, startingCoordsSetter, lastCoordsSetter, canvasWidth, canvasHeight, addDrawingCommand)
            }
            return
        default:
            console.log(`mouseUpAction not defined for tool type ${tool}`)
    }
}

export const mouseMoveAction = (mouseMoveEvent: MouseEvent, rect: DOMRect, tool: DrawingTool | null, contextTemp: CanvasRenderingContext2D, painting: boolean, startingCoords: StartingCoords | null, lastCoordsSetter: (coords: LastCoords) => void, canvasWidth: number, canvasHeight: number) => {
    
    const currentX = mouseMoveEvent.clientX - rect.left;
    const currentY = mouseMoveEvent.clientY - rect.top;
    
    switch(tool)
    {
        case DrawingTool.Line:
            if(startingCoords)
            {
                mouseMoveLineTool(currentX, currentY, contextTemp, painting, startingCoords, lastCoordsSetter, canvasWidth, canvasHeight)
            }
            return
        case DrawingTool.RadiusedCircle:
            if(startingCoords)
                {
                    mouseMoveRadiusedCircleTool(currentX, currentY, contextTemp, painting, startingCoords, lastCoordsSetter, canvasWidth, canvasHeight)
                }
            return
        default:
            console.log(`mouseMoveAction not implemented for tool type ${tool}`)
    }
}

