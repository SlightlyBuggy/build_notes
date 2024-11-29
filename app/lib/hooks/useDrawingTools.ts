import React, { useEffect, useState } from "react"
import { mouseUpAction, mouseDownAction, mouseMoveAction } from "@/app/ui/ImageEditor/lib/mouseActions";
import { DrawingTool } from "../util/enums";
import { StartingCoords, LastCoords, DrawingCommand } from "../util/types";

export const useDrawingTool = (canvasRefPerm: React.RefObject<HTMLCanvasElement>, canvasRefTemp: React.RefObject<HTMLCanvasElement>,
                         activeTool: DrawingTool | null, canvasWidth: number, canvasHeight: number, drawCommands: DrawingCommand[],
                         addDrawingCommand: (command: DrawingCommand) => void
) => {

    const [startingCoords, setStartingCoords] = useState<StartingCoords | null>(null);
    const [painting, setPainting] = useState<boolean>(false);
    const [lastCoords, setLastCoords] = useState<LastCoords | null>(null);

    // TODO: this should be something like "finishDraw" which cleans up starting and last coordinates as well as painting
    const paintingSetter = (paintingVal: boolean) => {
        console.log(`Set painting to ${paintingVal}`)
        setPainting(paintingVal)
    }

    const startingCoordsSetter = (coords: StartingCoords | null) => {
        console.log("Updating starting coords")
        setStartingCoords(coords)
    }

    const lastCoordsSetter = (coords: LastCoords | null) => {
        console.log("Updating last coords")
        setLastCoords(coords)
    }


    useEffect(() => {
        if(canvasRefPerm.current && canvasRefTemp.current && activeTool)
        {
            const canvasPerm = canvasRefPerm.current;
            const contextPerm = canvasPerm.getContext('2d');

            const canvasTemp = canvasRefTemp.current;
            const contextTemp = canvasTemp.getContext('2d');

            const rect = canvasPerm.getBoundingClientRect();
            
            if(contextPerm && contextTemp)
            {
                const mouseDownListener = (event: MouseEvent) => { 
                    mouseDownAction(event, rect, activeTool, contextPerm, paintingSetter, startingCoordsSetter, addDrawingCommand); 
                };

                const mouseUpListener = () => {
                    mouseUpAction(activeTool, contextPerm, contextTemp, startingCoords, lastCoords, paintingSetter, startingCoordsSetter, lastCoordsSetter, canvasWidth, canvasHeight, addDrawingCommand)
                };

                const mouseMoveListener = (event: MouseEvent) => {
                    mouseMoveAction(event, rect, activeTool, contextTemp, painting, startingCoords, lastCoordsSetter, canvasWidth, canvasHeight)
                }

                canvasPerm.addEventListener('mousedown', mouseDownListener);
                canvasPerm.addEventListener('mouseup', mouseUpListener)
                canvasPerm.addEventListener('mousemove', mouseMoveListener)

                return () => {
                    canvasPerm.removeEventListener('mousedown', mouseDownListener);
                    canvasPerm.removeEventListener('mouseup', mouseUpListener);
                    canvasPerm.removeEventListener('mousemove', mouseMoveListener);
                }
            }
        }
    }, [activeTool, painting, startingCoords, lastCoords, drawCommands]);
}