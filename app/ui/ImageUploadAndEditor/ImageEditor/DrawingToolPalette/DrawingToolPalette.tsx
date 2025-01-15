'use client';
import RedoButton from './RedoButton';
import ToolButton from './ToolButton';
import { DrawingTool } from '@/app/lib/util/enums';
import UndoButton from './UndoButton';
import { StyledDrawingCommand } from '@/app/lib/util/types';
import StrokeWidthSelector, {
  StrokeItem,
} from './StrokeSelection/StrokeWidthSelector';
import ColorSelector from './ColorSelection/ColorSelector';

export default function DrawingToolPalette({
  activeTool,
  handleToolClick,
  undoLastDrawingCommand,
  drawingCommands,
  redoLastUndoneCommand,
  undoneDrawCommandHistories,
  selectedStrokeItem,
  setSelectedStrokeItem,
  selectedColor,
  setSelectedColor,
}: {
  activeTool: DrawingTool | null;
  handleToolClick: (tool: DrawingTool) => void;
  undoLastDrawingCommand: () => void;
  drawingCommands: StyledDrawingCommand[];
  redoLastUndoneCommand: () => void;
  undoneDrawCommandHistories: Array<StyledDrawingCommand[]>;
  selectedStrokeItem: StrokeItem;
  setSelectedStrokeItem: (strokeItem: StrokeItem) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
}) {
  return (
    <div className="flex flex-row p-5 select-none max-h-20 relative">
      <ToolButton
        tool={DrawingTool.Selector}
        activeTool={activeTool}
        handleToolClick={handleToolClick}
      />
      <ToolButton
        tool={DrawingTool.Line}
        activeTool={activeTool}
        handleToolClick={handleToolClick}
      />
      <ToolButton
        tool={DrawingTool.Rectangle}
        activeTool={activeTool}
        handleToolClick={handleToolClick}
      />
      <ToolButton
        tool={DrawingTool.RadiusedCircle}
        activeTool={activeTool}
        handleToolClick={handleToolClick}
      />
      <ToolButton
        tool={DrawingTool.Text}
        activeTool={activeTool}
        handleToolClick={handleToolClick}
        innerText="T"
      />
      <div className="p-3 flex items-center">
        <div className="h-8 w-0.5 bg-slate-500"></div>
      </div>
      <StrokeWidthSelector
        selectedStrokeItem={selectedStrokeItem}
        setSelectedStrokeItem={setSelectedStrokeItem}
      />
      <ColorSelector
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
      />
      <div className="p-3 flex items-center">
        <div className="h-8 w-0.5 bg-slate-500"></div>
      </div>
      <UndoButton
        undoLastDrawingCommand={undoLastDrawingCommand}
        drawingCommands={drawingCommands}
      />
      <RedoButton
        redoLastUndoneCommand={redoLastUndoneCommand}
        undoneDrawCommandHistories={undoneDrawCommandHistories}
      />
    </div>
  );
}
