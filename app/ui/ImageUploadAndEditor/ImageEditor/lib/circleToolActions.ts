import { DrawingTool } from "@/app/lib/util/enums";
import { DrawingCommand } from "@/app/lib/util/types";

export const mouseDownCircleTool = (currentX: number, currentY: number, ctx: CanvasRenderingContext2D, addDrawingCommand: (command: DrawingCommand) => void) => {
    const command: DrawingCommand = {
        drawingTool: DrawingTool.Circle,
        startX: currentX,
        startY: currentY
    };

    addDrawingCommand(command);
}



