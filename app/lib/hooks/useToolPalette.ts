import { useState } from "react";
import { DrawingTool } from "../util/enums";

export const useToolPalette = () => {

    // TODO: move stateful stuff of StrokeWidthSelector here
    const [activeTool, setActiveTool] = useState<DrawingTool>(DrawingTool.Selector);

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
