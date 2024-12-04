import { DrawingTool } from "@/app/lib/util/enums";
import { toolButtonStyleFactory } from "./classes/ToolButtonStyle";

// TODO: inverse video when tool is selected?

export default function ToolButton(
    {tool, activeTool, handleToolClick}: 
    {tool: DrawingTool, 
     activeTool: DrawingTool | null, 
     handleToolClick: (tool: DrawingTool) => void}) {

    const drawingToolObj = toolButtonStyleFactory(tool, activeTool);
        return (
        <div className="p-3 flex items-center" onClick={() => handleToolClick(tool)}>
            <div className={drawingToolObj.outerStyle}>
                <div className={drawingToolObj.innerStyle}></div>
            </div>
        </div>
        )
}