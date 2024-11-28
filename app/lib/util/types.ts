import { DrawingTool } from "./enums"

export type StartingCoords = {
    startX: number,
    startY: number
}

export type LastCoords = {
    lastX: number,
    lastY: number
}

export type DrawingCommand = {
    drawingTool: DrawingTool
    startX: number
    startY: number
    endX?: number
    endY?: number
}