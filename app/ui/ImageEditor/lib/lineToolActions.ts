import { StartingCoords, LastCoords } from "@/app/lib/util/types";

export const mouseUpLineTool = (contextPerm: CanvasRenderingContext2D, contextTemp: CanvasRenderingContext2D, startingCoords: StartingCoords, lastCoords: LastCoords, paintingSetter: (paintingVal: boolean) => void, startingCoordsSetter: (startingCoords: StartingCoords | null) => void, lastCoordsSetter: (coords: LastCoords | null) => void, canvasWidth: number, canvasHeight: number) => {
    paintingSetter(false);
    contextPerm.strokeStyle = "#000";
    contextPerm.beginPath();
    contextPerm.moveTo(startingCoords.startX, startingCoords.startY);
    contextPerm.lineTo(lastCoords.lastX, lastCoords.lastY);
    contextPerm.stroke();
    contextTemp.clearRect(0, 0, canvasWidth, canvasHeight)
    startingCoordsSetter(null);
    lastCoordsSetter(null);
}

export const mouseMoveLineTool = (currentX: number, currentY: number, contextTemp: CanvasRenderingContext2D, painting: boolean, startingCoords: StartingCoords, lastCoordsSetter: (coords: LastCoords) => void, canvasWidth: number, canvasHeight: number) => {
    if(painting)
    {
        lastCoordsSetter({lastX: currentX, lastY: currentY})
        contextTemp.clearRect(0, 0, canvasWidth, canvasHeight);
        contextTemp.beginPath();
        contextTemp.moveTo(startingCoords.startX, startingCoords.startY);
        contextTemp.lineTo(currentX, currentY);
        contextTemp.stroke();
    }
}

export const mouseDownLineTool = (currentX: number, currentY: number, paintingSetter: (paintingVal: boolean) => void, startingCoordsSetter: (coords: StartingCoords) => void, ) => {
    startingCoordsSetter({startX: currentX, startY: currentY});
    paintingSetter(true)
}