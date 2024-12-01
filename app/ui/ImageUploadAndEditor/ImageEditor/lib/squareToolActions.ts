import { DrawingTool } from "@/app/lib/util/enums";
import { DrawingCommand } from "@/app/lib/util/types";

export const mouseDownSquareTool = (currentX: number, currentY: number, ctx: CanvasRenderingContext2D, addDrawingCommand: (command: DrawingCommand) => void) => {
    const command: DrawingCommand = {
        drawingTool: DrawingTool.Square,
        startX: currentX,
        startY: currentY
    };
    addDrawingCommand(command)
}