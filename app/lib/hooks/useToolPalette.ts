import { useState } from "react";
import { DrawingTool } from "../util/enums";

export const useToolPalette = () => {
    const [activeTool, setActiveTool] = useState<null|DrawingTool>(null);

    const handleToolClick = (tool: DrawingTool) => {
        // only switch tools if we've clicked a different oneß
        if(tool === activeTool)
        {
            return
        }

        setActiveTool(tool);
    }

    return {handleToolClick, activeTool}
}
