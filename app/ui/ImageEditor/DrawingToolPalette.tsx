'use client'
import RedoButton from "./redoButton"
import ToolButton from "./toolButton"
import { DrawingTool } from "@/app/lib/util/enums"
import UndoButton from "./undoButton"
import { DrawingCommand } from "@/app/lib/util/types"

export default function DrawingToolPalette(
    {
        activeTool, handleToolClick, undoLastDrawingCommand, drawingCommands, redoLastUndoneCommand, undoneDrawCommands

    } : {
        activeTool: DrawingTool | null, handleToolClick: (tool: DrawingTool) => void, 
        undoLastDrawingCommand: () => void, drawingCommands: DrawingCommand[], 
        redoLastUndoneCommand: () => void, undoneDrawCommands: DrawingCommand[]
    }
) {

    return (
    <div className="flex flex-row p-5 select-none">
        <ToolButton tool={DrawingTool.Circle} activeTool={activeTool} handleToolClick={handleToolClick}/>
        <ToolButton tool={DrawingTool.Square} activeTool={activeTool} handleToolClick={handleToolClick}/>
        <ToolButton tool={DrawingTool.Line} activeTool={activeTool} handleToolClick={handleToolClick} />
        <ToolButton tool={DrawingTool.RadiusedCircle} activeTool={activeTool} handleToolClick={handleToolClick}/>
        <div className="p-3" ></div>
        <UndoButton undoLastDrawingCommand={undoLastDrawingCommand} drawingCommands={drawingCommands}/>
        <RedoButton redoLastUndoneCommand={redoLastUndoneCommand} undoneDrawCommands={undoneDrawCommands}/>
    </div>
    )
}