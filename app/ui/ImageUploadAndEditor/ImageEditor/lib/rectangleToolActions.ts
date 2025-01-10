import { DrawingTool } from '@/app/lib/util/enums';
import {
  StartingCoords,
  LastCoords,
  UnstyledDrawingCommand,
} from '@/app/lib/util/types';
import { getObjectBoundaries } from '@/app/lib/util/selectorDrawingTool';
export const mouseUpRectangleTool = (
  startingCoords: StartingCoords | null,
  lastCoords: LastCoords | null,
  addDrawingCommand: (command: UnstyledDrawingCommand) => void
) => {
  if (startingCoords && lastCoords) {
    // TODO: find a more seamless way to do this.  drawingCommandFactory or whatever
    const command: UnstyledDrawingCommand = {
      drawingTool: DrawingTool.Rectangle,
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

export const mouseMoveRectangleTool = (
  currentX: number,
  currentY: number,
  painting: boolean,
  startingCoords: StartingCoords | null,
  lastCoordsSetter: (coords: LastCoords) => void,
  tempDrawCommandSetter: (command: UnstyledDrawingCommand) => void
) => {
  if (painting && startingCoords) {
    lastCoordsSetter({ lastX: currentX, lastY: currentY });

    const command: UnstyledDrawingCommand = {
      drawingTool: DrawingTool.Rectangle,
      startX: startingCoords.startX,
      startY: startingCoords.startY,
      endX: currentX,
      endY: currentY,
    };

    tempDrawCommandSetter(command);
  }
};

export const mouseDownRectangleTool = (
  currentX: number,
  currentY: number,
  paintingSetter: (paintingVal: boolean) => void,
  startingCoordsSetter: (coords: StartingCoords) => void,
  lastCoordsSetter: (lastCoords: LastCoords) => void
) => {
  startingCoordsSetter({ startX: currentX, startY: currentY });
  lastCoordsSetter({ lastX: currentX, lastY: currentY });
  paintingSetter(true);
};
