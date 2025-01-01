'use client'
import RedoButton from "./RedoButton"
import ToolButton from "./ToolButton"
import { DrawingTool } from "@/app/lib/util/enums"
import UndoButton from "./UndoButton"
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
        <ToolButton tool={DrawingTool.Selector} activeTool={activeTool} handleToolClick={handleToolClick} />
        <ToolButton tool={DrawingTool.Line} activeTool={activeTool} handleToolClick={handleToolClick} />
        <ToolButton tool={DrawingTool.Rectangle} activeTool={activeTool} handleToolClick={handleToolClick} />
        <ToolButton tool={DrawingTool.RadiusedCircle} activeTool={activeTool} handleToolClick={handleToolClick}/>
        <ToolButton tool={DrawingTool.Text} activeTool={activeTool} handleToolClick={handleToolClick} innerText='T'/>
        <div className="p-3" ></div>
        <UndoButton undoLastDrawingCommand={undoLastDrawingCommand} drawingCommands={drawingCommands}/>
        <RedoButton redoLastUndoneCommand={redoLastUndoneCommand} undoneDrawCommands={undoneDrawCommands}/>
    </div>
    )
}