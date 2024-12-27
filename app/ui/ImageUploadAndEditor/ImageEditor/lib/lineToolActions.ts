import { DrawingTool } from "@/app/lib/util/enums";
import { StartingCoords, LastCoords, DrawingCommand } from "@/app/lib/util/types";
import { clearCanvas } from "@/app/lib/util/image";
// TODO: find  way to reduce the number of arguments for all action functinos
export const mouseUpLineTool = (contextTemp: CanvasRenderingContext2D, startingCoords: StartingCoords | null, lastCoords: LastCoords | null, paintingSetter: (paintingVal: boolean) => void, startingCoordsSetter: (startingCoords: StartingCoords | null) => void, lastCoordsSetter: (coords: LastCoords | null) => void, canvasWidth: number, canvasHeight: number, addDrawingCommand: (command: DrawingCommand) => void) => {

    if(startingCoords && lastCoords)
    {
        const command: DrawingCommand = {
            drawingTool: DrawingTool.Line,
            startX: startingCoords.startX,
            startY: startingCoords.startY,
            endX: lastCoords.lastX,
            endY: lastCoords.lastY
        }
        addDrawingCommand(command)
    
        paintingSetter(false);
        startingCoordsSetter(null);
        lastCoordsSetter(null);
    
        clearCanvas(contextTemp, canvasWidth, canvasHeight)
    }
}

export const mouseMoveLineTool = (currentX: number, currentY: number, contextTemp: CanvasRenderingContext2D, painting: boolean, startingCoords: StartingCoords | null, lastCoordsSetter: (coords: LastCoords) => void, canvasWidth: number, canvasHeight: number) => {
    if(painting && startingCoords)
    {
        console.log(`currentX: ${currentX}, currentY: ${currentY}`)
        lastCoordsSetter({lastX: currentX, lastY: currentY})
        clearCanvas(contextTemp, canvasWidth, canvasHeight)
        contextTemp.beginPath();
        contextTemp.moveTo(startingCoords.startX, startingCoords.startY);
        contextTemp.lineTo(currentX, currentY);
        contextTemp.stroke();
    }
}

export const mouseDownLineTool = (currentX: number, currentY: number, paintingSetter: (paintingVal: boolean) => void, startingCoordsSetter: (coords: StartingCoords) => void) => {
    startingCoordsSetter({startX: currentX, startY: currentY});
    paintingSetter(true)
}