import { StartingCoords, LastCoords, DrawingCommand } from "@/app/lib/util/types";
import { distanceBetweenPoints } from "@/app/lib/util/formulae";
import { DrawingTool } from "@/app/lib/util/enums";

export const mouseUpRadiusedCircleTool = (contextPerm: CanvasRenderingContext2D, contextTemp: CanvasRenderingContext2D, startingCoords: StartingCoords, lastCoords: LastCoords, paintingSetter: (paintingVal: boolean) => void, startingCoordsSetter: (startingCoords: StartingCoords | null) => void, lastCoordsSetter: (coords: LastCoords | null) => void, canvasWidth: number, canvasHeight: number, addDrawingCommand: (command: DrawingCommand) => void) => {
    paintingSetter(false)
    
    const radius = distanceBetweenPoints(startingCoords.startX, startingCoords.startY, lastCoords.lastX, lastCoords.lastY)
    const command: DrawingCommand = {
        drawingTool: DrawingTool.RadiusedCircle,
        startX: startingCoords.startX,
        startY: startingCoords.startY,
        radius: radius
    }
    addDrawingCommand(command)

    startingCoordsSetter(null);
    lastCoordsSetter(null);
}

export const mouseMoveRadiusedCircleTool = (currentX: number, currentY: number, contextTemp: CanvasRenderingContext2D, painting: boolean, startingCoords: StartingCoords, lastCoordsSetter: (coords: LastCoords) => void, canvasWidth: number, canvasHeight: number) => {
    if(painting)
    {
        lastCoordsSetter({lastX: currentX, lastY: currentY})
        contextTemp.clearRect(0, 0, canvasWidth, canvasHeight);
        contextTemp.beginPath();
        const radius = distanceBetweenPoints(startingCoords.startX, startingCoords.startY, currentX, currentY)
        contextTemp.arc(startingCoords.startX, startingCoords.startY, radius, 0, 2*Math.PI)
        contextTemp.stroke();
    }
}

export const mouseDownRadiusedCircleTool = (currentX: number, currentY: number, paintingSetter: (paintingVal: boolean) => void, startingCoordsSetter: (coords: StartingCoords) => void) => {
    startingCoordsSetter({startX: currentX, startY: currentY});
    paintingSetter(true)
}