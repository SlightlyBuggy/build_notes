import {
  StartingCoords,
  LastCoords,
  DrawingCommand,
} from '@/app/lib/util/types';
import { distanceBetweenPoints } from '@/app/lib/util/formulae';
import { DrawingTool } from '@/app/lib/util/enums';
import { clearCanvas } from '@/app/lib/util/image';
import { getObjectBoundaries } from '@/app/lib/util/selectorDrawingTool';
import { StrokeItem } from '../DrawingToolPalette/StrokeSelection/StrokeWidthSelector';

export const mouseUpRadiusedCircleTool = (
  contextTemp: CanvasRenderingContext2D,
  startingCoords: StartingCoords | null,
  lastCoords: LastCoords | null,
  paintingSetter: (paintingVal: boolean) => void,
  startingCoordsSetter: (startingCoords: StartingCoords | null) => void,
  lastCoordsSetter: (coords: LastCoords | null) => void,
  canvasWidth: number,
  canvasHeight: number,
  addDrawingCommand: (command: DrawingCommand) => void,
  selectedStrokeItem: StrokeItem,
  selectedColor: string
) => {
  if (startingCoords && lastCoords) {
    paintingSetter(false);

    const radius = distanceBetweenPoints(
      startingCoords.startX,
      startingCoords.startY,
      lastCoords.lastX,
      lastCoords.lastY
    );
    const command: DrawingCommand = {
      drawingTool: DrawingTool.RadiusedCircle,
      startX: startingCoords.startX,
      startY: startingCoords.startY,
      radius: radius,
      strokeWidth: selectedStrokeItem.strokeWidthPx,
      color: selectedColor,
    };

    const objectBoundaries = getObjectBoundaries({
      toolType: command.drawingTool,
      startX: command.startX,
      startY: command.startY,
      radius: command.radius,
    });
    command.objectBoundaries = objectBoundaries;

    addDrawingCommand(command);

    startingCoordsSetter(null);
    lastCoordsSetter(null);

    clearCanvas(contextTemp, canvasWidth, canvasHeight);
  }
};

export const mouseMoveRadiusedCircleTool = (
  currentX: number,
  currentY: number,
  contextTemp: CanvasRenderingContext2D,
  painting: boolean,
  startingCoords: StartingCoords | null,
  lastCoordsSetter: (coords: LastCoords) => void,
  canvasWidth: number,
  canvasHeight: number,
  selectedStrokeItem: StrokeItem,
  selectedColor: string
) => {
  if (painting && startingCoords) {
    lastCoordsSetter({ lastX: currentX, lastY: currentY });
    contextTemp.strokeStyle = selectedColor;
    contextTemp.clearRect(0, 0, canvasWidth, canvasHeight);
    contextTemp.lineWidth = selectedStrokeItem.strokeWidthPx;
    contextTemp.beginPath();
    const radius = distanceBetweenPoints(
      startingCoords.startX,
      startingCoords.startY,
      currentX,
      currentY
    );
    contextTemp.arc(
      startingCoords.startX,
      startingCoords.startY,
      radius,
      0,
      2 * Math.PI
    );
    contextTemp.stroke();
  }
};

export const mouseDownRadiusedCircleTool = (
  currentX: number,
  currentY: number,
  paintingSetter: (paintingVal: boolean) => void,
  startingCoordsSetter: (coords: StartingCoords) => void
) => {
  startingCoordsSetter({ startX: currentX, startY: currentY });
  paintingSetter(true);
};
