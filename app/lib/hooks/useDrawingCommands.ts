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
                // need abstract class for DrawingCommand and subclasses for each type of tool 
                for(let command of drawCommands)
                {
                    switch(command.drawingTool) {
                        case DrawingTool.Circle:
                            contextPerm.beginPath();
                            contextPerm.arc(command.startX, command.startY, 10, 0, 2 * Math.PI);
                            contextPerm.fillStyle = 'green';
                            contextPerm.fill();
                            break;
                        case DrawingTool.Square:
                            contextPerm.beginPath();
                            contextPerm.rect(command.startX, command.startY, 10, 10);
                            contextPerm.fillStyle = 'yellow';
                            contextPerm.fill();
                            break;
                        case DrawingTool.Line:
                            if(command.endX && command.endY)
                            {
                                contextPerm.strokeStyle = "#000";
                                contextPerm.beginPath();
                                contextPerm.moveTo(command.startX, command.startY);
                                contextPerm.lineTo(command.endX, command.endY);
                                contextPerm.stroke();
                            }
                            break;
                        case DrawingTool.RadiusedCircle:
                            if(command.radius)
                            {
                                contextPerm.strokeStyle = "#000";
                                contextPerm.beginPath();
                                contextPerm.arc(command.startX, command.startY, command.radius, 0, 2*Math.PI)
                                contextPerm.stroke();
                            }
                            break;
                    }
                }
            }
        }
    }, [drawCommands])
}