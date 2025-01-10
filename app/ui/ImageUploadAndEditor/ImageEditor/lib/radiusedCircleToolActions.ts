import {
  StartingCoords,
  LastCoords,
  UnstyledDrawingCommand,
} from '@/app/lib/util/types';
import { distanceBetweenPoints } from '@/app/lib/util/formulae';
import { DrawingTool } from '@/app/lib/util/enums';
import { getObjectBoundaries } from '@/app/lib/util/selectorDrawingTool';

export const mouseUpRadiusedCircleTool = (
  startingCoords: StartingCoords | null,
  lastCoords: LastCoords | null,
  paintingSetter: (paintingVal: boolean) => void,
  addDrawingCommand: (command: UnstyledDrawingCommand) => void
) => {
  if (startingCoords && lastCoords) {
    paintingSetter(false);

    const radius = distanceBetweenPoints(
      startingCoords.startX,
      startingCoords.startY,
      lastCoords.lastX,
      lastCoords.lastY
    );
    const command: UnstyledDrawingCommand = {
      drawingTool: DrawingTool.RadiusedCircle,
      startX: startingCoords.startX,
      startY: startingCoords.startY,
      radius: radius,
    };

    const objectBoundaries = getObjectBoundaries({
      toolType: command.drawingTool,
      startX: command.startX,
      startY: command.startY,
      radius: command.radius,
    });
    command.objectBoundaries = objectBoundaries;

    addDrawingCommand(command);
  }
};

export const mouseMoveRadiusedCircleTool = (
  currentX: number,
  currentY: number,
  painting: boolean,
  startingCoords: StartingCoords | null,
  lastCoordsSetter: (coords: LastCoords) => void,
  tempDrawCommandSetter: (command: UnstyledDrawingCommand) => void
) => {
  if (painting && startingCoords) {
    lastCoordsSetter({ lastX: currentX, lastY: currentY });

    const radius = distanceBetweenPoints(
      startingCoords.startX,
      startingCoords.startY,
      currentX,
      currentY
    );

    const command: UnstyledDrawingCommand = {
      drawingTool: DrawingTool.RadiusedCircle,
      startX: startingCoords.startX,
      startY: startingCoords.startY,
      radius: radius,
    };

    tempDrawCommandSetter(command);
  }
};

export const mouseDownRadiusedCircleTool = (
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
