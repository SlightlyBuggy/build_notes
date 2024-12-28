import { DrawingTool } from "@/app/lib/util/enums";
import { DrawingCommand } from "@/app/lib/util/types";

export const mouseDownCircleTool = (currentX: number, currentY: number, addDrawingCommand: (command: DrawingCommand) => void) => {
    const command: DrawingCommand = {
        drawingTool: DrawingTool.Circle,
        startX: currentX,
        startY: currentY
    };

    addDrawingCommand(command);
}



