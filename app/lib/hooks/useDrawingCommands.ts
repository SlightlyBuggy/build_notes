import { useEffect, useState } from "react";
import { DrawingCommand } from "../util/types";
import { drawCommandExecutorFactory } from "@/app/ui/ImageUploadAndEditor/ImageEditor/classes/DrawingToolCommandExecutor";


export const useDrawingCommands = (canvasRefPerm: React.RefObject<HTMLCanvasElement>) => {

    const [drawCommands, setDrawCommands] = useState<DrawingCommand[]>([])
    const [undoneDrawCommands, setUndoneDrawCommands] = useState<DrawingCommand[]>([])

    const drawCommandsSetter = (commands: DrawingCommand[]) => {
        setDrawCommands(commands)
    }

    const addDrawingCommand = (command: DrawingCommand) => {
        setDrawCommands([...drawCommands, command])
        // when a new command is added, we clear the list of undone commands.  otherwise things could get confusing for the user.
        setUndoneDrawCommands([])
    }

    const undoLastDrawingCommand = () => {
        const currentCommands = [...drawCommands]
        const lastCommand : DrawingCommand | undefined = currentCommands.pop()
        if(lastCommand)
        {
            setUndoneDrawCommands([...undoneDrawCommands, lastCommand])
            setDrawCommands(currentCommands)
        }
    }

    const redoLastUndoneCommand = () => {
        const currentUndoneCommands = [...undoneDrawCommands]
        const commandToRedo = currentUndoneCommands.pop()
        if(commandToRedo)
        {
            setDrawCommands([...drawCommands, commandToRedo])
            setUndoneDrawCommands(currentUndoneCommands)
        }
    }

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

    return {drawCommands, undoneDrawCommands, addDrawingCommand, drawCommandsSetter, undoLastDrawingCommand, redoLastUndoneCommand}
}
