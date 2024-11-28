'use client'
import ToolButton from "./toolButton"
import { DrawingTool } from "@/app/lib/util/enums"

export default function DrawingToolPalette(
    {activeTool, handleToolClick} : {activeTool: DrawingTool | null, handleToolClick: (tool: DrawingTool) => void}
) {

    return (
    <div className="flex flex-row p-5 bg-slate-400">
        <ToolButton tool={DrawingTool.Circle} activeTool={activeTool} handleToolClick={handleToolClick}/>
        <ToolButton tool={DrawingTool.Square} activeTool={activeTool} handleToolClick={handleToolClick}/>
        <ToolButton tool={DrawingTool.Line} activeTool={activeTool} handleToolClick={handleToolClick}/>
        <ToolButton tool={DrawingTool.RadiusedCircle} activeTool={activeTool} handleToolClick={handleToolClick}/>
    </div>
    )
}