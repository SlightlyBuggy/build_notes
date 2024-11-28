import { useEffect } from "react";
import { DrawingCommand } from "../util/types";
import { DrawingTool } from "../util/enums";


export const useDrawingCommands = (canvasRefPerm: React.RefObject<HTMLCanvasElement>, drawCommands: DrawingCommand[]) => {
    useEffect(() => {
        // when draw commands change, clear canvas and replay all commands
        if(canvasRefPerm.current)
        {
            const canvasPerm = canvasRefPerm.current;
            const contextPerm = canvasPerm.getContext('2d');

            const rect = canvasPerm.getBoundingClientRect();

            if(contextPerm)
            {
                contextPerm.clearRect(0, 0, rect.width, rect.height)
                // needs to be part of drawing command subclass
                for(let command of drawCommands)
                {
                    switch(command.drawingTool) {
                        case DrawingTool.Circle:
                            contextPerm.beginPath();
                            contextPerm.arc(command.startX, command.startY, 10, 0, 2 * Math.PI);
                            contextPerm.fillStyle = 'green';
                            contextPerm.fill();
                    }
                }
            }
        }
    }, [drawCommands])
}