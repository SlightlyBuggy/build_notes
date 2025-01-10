import { DrawingTool } from '@/app/lib/util/enums';
import {
  StartingCoords,
  LastCoords,
  UnstyledDrawingCommand,
} from '@/app/lib/util/types';
import { getObjectBoundaries } from '@/app/lib/util/selectorDrawingTool';
// TODO: find  way to reduce the number of arguments for all action functinos
export const mouseUpLineTool = (
  startingCoords: StartingCoords | null,
  lastCoords: LastCoords | null,
  addDrawingCommand: (command: UnstyledDrawingCommand) => void
) => {
  if (startingCoords && lastCoords) {
    const command: UnstyledDrawingCommand = {
      drawingTool: DrawingTool.Line,
      startX: startingCoords.startX,
      startY: startingCoords.startY,
      endX: lastCoords.lastX,
      endY: lastCoords.lastY,
    };

    const objectBoundaries = getObjectBoundaries({
      toolType: command.drawingTool,
      startX: command.startX,
      startY: command.startY,
      endX: command.endX,
      endY: command.endY,
    });
    command.objectBoundaries = objectBoundaries;

    addDrawingCommand(command);
  }
};

export const mouseMoveLineTool = (
  currentX: number,
  currentY: number,
  painting: boolean,
  startingCoords: StartingCoords | null,
  lastCoordsSetter: (coords: LastCoords) => void,
  tempDrawCommandSetter: (command: UnstyledDrawingCommand) => void
) => {
  if (painting && startingCoords) {
    const command: UnstyledDrawingCommand = {
      drawingTool: DrawingTool.Line,
      startX: startingCoords.startX,
      startY: startingCoords.startY,
      endX: currentX,
      endY: currentY,
    };
    tempDrawCommandSetter(command);
    lastCoordsSetter({ lastX: currentX, lastY: currentY });
  }
};

export const mouseDownLineTool = (
  currentX: number,
  currentY: number,
  mouseDownHandlerForToolsWithPreview: (coords: StartingCoords) => void
) => {
  mouseDownHandlerForToolsWithPreview({ startX: currentX, startY: currentY });
};
