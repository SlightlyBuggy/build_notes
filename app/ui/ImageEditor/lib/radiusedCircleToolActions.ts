import { StartingCoords, LastCoords } from "@/app/lib/util/types";
import { distanceBetweenPoints } from "@/app/lib/util/formulae";

export const mouseUpRadiusedCircleTool = (contextPerm: CanvasRenderingContext2D, contextTemp: CanvasRenderingContext2D, startingCoords: StartingCoords, lastCoords: LastCoords, paintingSetter: (paintingVal: boolean) => void, startingCoordsSetter: (startingCoords: StartingCoords | null) => void, lastCoordsSetter: (coords: LastCoords | null) => void, canvasWidth: number, canvasHeight: number) => {
    paintingSetter(false)
    contextPerm.strokeStyle = "#000";
    contextPerm.beginPath();
    const radius = distanceBetweenPoints(startingCoords.startX, startingCoords.startY, lastCoords.lastX, lastCoords.lastY)
    contextPerm.arc(startingCoords.startX, startingCoords.startY, radius, 0, 2*Math.PI)
    contextPerm.stroke();
    contextTemp.clearRect(0, 0, canvasWidth, canvasHeight)
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

export const mouseDownRadiusedCircleTool = (currentX: number, currentY: number, paintingSetter: (paintingVal: boolean) => void, startingCoordsSetter: (coords: StartingCoords) => void, ) => {
    startingCoordsSetter({startX: currentX, startY: currentY});
    paintingSetter(true)
}