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
  addDrawingCommand: (command: UnstyledDrawingCommand) => void
) => {
  if (startingCoords && lastCoords) {
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
  setTempDrawCommandAndLastCoords: (command: UnstyledDrawingCommand) => void
) => {
  if (painting && startingCoords) {
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

    setTempDrawCommandAndLastCoords(command);
  }
};

export const mouseDownRadiusedCircleTool = (
  currentX: number,
  currentY: number,
  mouseDownHandlerForToolsWithPreview: (coords: StartingCoords) => void
) => {
  mouseDownHandlerForToolsWithPreview({ startX: currentX, startY: currentY });
};
