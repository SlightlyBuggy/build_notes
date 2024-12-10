import { useEffect } from "react";
import { DrawingCommand } from "../util/types";
import { drawCommandExecutorFactory } from "@/app/ui/ImageUploadAndEditor/ImageEditor/classes/DrawingToolCommandExecutor";


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

                for(let command of drawCommands)
                {   
                    const drawCommandExecutor = drawCommandExecutorFactory(command, contextPerm)
                    drawCommandExecutor.executeCommand()
                }
            }
        }
    }, [drawCommands])
}