'use client'
import { StaticImageData } from "next/image";
import React, { useEffect, useRef, useState } from "react"
import { DrawingTool } from "@/app/lib/util/enums";
import { useDrawingTool } from "@/app/lib/hooks/useDrawingTools";
import ImageAndCanvases from "./ImageAndCanvases";
import DrawingToolPalette from "./DrawingToolPalette";
import SaveDrawingButton from "./SaveDrawingButton";
import { DrawingCommand } from "@/app/lib/util/types";
import { useDrawingCommands } from "@/app/lib/hooks/useDrawingCommands";
import { saveImage } from "@/app/lib/util/image";


export default function ImageEditor({
    imageData
}: {
    imageData: StaticImageData
}) {

    const canvasRefPerm = useRef<HTMLCanvasElement>(null);
    const canvasRefTemp = useRef<HTMLCanvasElement>(null);

    const [activeTool, setActiveTool] = useState<null|DrawingTool>(null);

    const [drawCommands, setDrawCommands] = useState<DrawingCommand[]>([])

    const handleToolClick = (tool: DrawingTool) => {
        setActiveTool(tool);
    }

    const canvasHeight = imageData.height;
    const canvasWidth = imageData.width;

    const addDrawingCommand = (command: DrawingCommand) => {
        console.log(`Adding draw commands.  Current commands: ${JSON.stringify(drawCommands)}.  Incoming command: ${command}`)
        setDrawCommands([...drawCommands, command])
    }

    useDrawingCommands(canvasRefPerm, drawCommands);

    useDrawingTool(canvasRefPerm, canvasRefTemp, activeTool, canvasWidth, canvasHeight, drawCommands, addDrawingCommand);

    return (
        <div>
            <DrawingToolPalette activeTool={activeTool} handleToolClick={handleToolClick}/>
            <ImageAndCanvases 
                imageData={imageData} 
                canvasHeight={canvasHeight} 
                canvasWidth={canvasWidth} 
                canvasRefPerm={canvasRefPerm} 
                canvasRefTemp={canvasRefTemp}
            />
            <SaveDrawingButton saveImage={() => saveImage(canvasRefPerm)} />
        </div>
        )
}