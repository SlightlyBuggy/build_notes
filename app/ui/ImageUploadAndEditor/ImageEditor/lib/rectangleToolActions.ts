import { DrawingTool } from "@/app/lib/util/enums";
import { StartingCoords, LastCoords, DrawingCommand } from "@/app/lib/util/types";
import { clearCanvas } from "@/app/lib/util/image";
import { getObjectBoundaries } from "@/app/lib/util/selectorDrawingTool";
// TODO: find  way to reduce the number of arguments for all action functinos
export const mouseUpRectangleTool = (contextTemp: CanvasRenderingContext2D, startingCoords: StartingCoords | null, lastCoords: LastCoords | null, paintingSetter: (paintingVal: boolean) => void, startingCoordsSetter: (startingCoords: StartingCoords | null) => void, lastCoordsSetter: (coords: LastCoords | null) => void, canvasWidth: number, canvasHeight: number, addDrawingCommand: (command: DrawingCommand) => void) => {

    if(startingCoords && lastCoords)
    {
        // TODO: find a more seamless way to do this.  drawingCommandFactory or whatever
        const command: DrawingCommand = {
            drawingTool: DrawingTool.Rectangle,
            startX: startingCoords.startX,
            startY: startingCoords.startY,
            endX: lastCoords.lastX,
            endY: lastCoords.lastY
        }

        const objectBoundaries = getObjectBoundaries({toolType: command.drawingTool, startX: command.startX, startY: command.startY, endX: command.endX, endY: command.endY})
        command.objectBoundaries = objectBoundaries

        addDrawingCommand(command)
    
        paintingSetter(false);
        startingCoordsSetter(null);
        lastCoordsSetter(null);
    
        clearCanvas(contextTemp, canvasWidth, canvasHeight)
    }
}

export const mouseMoveRectangleTool = (currentX: number, currentY: number, contextTemp: CanvasRenderingContext2D, painting: boolean, startingCoords: StartingCoords | null, lastCoordsSetter: (coords: LastCoords) => void, canvasWidth: number, canvasHeight: number) => {
    if(painting && startingCoords)
    {
        lastCoordsSetter({lastX: currentX, lastY: currentY})
        clearCanvas(contextTemp, canvasWidth, canvasHeight)

        const width = currentX - startingCoords.startX 
        const height = currentY - startingCoords.startY
        contextTemp.strokeRect(startingCoords.startX, startingCoords.startY, width, height);
    }
}

export const mouseDownRectangleTool = (currentX: number, currentY: number, paintingSetter: (paintingVal: boolean) => void, startingCoordsSetter: (coords: StartingCoords) => void) => {
    startingCoordsSetter({startX: currentX, startY: currentY});
    paintingSetter(true)
}