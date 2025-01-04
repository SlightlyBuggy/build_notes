import { DrawingTool } from '@/app/lib/util/enums';
import {
  StartingCoords,
  LastCoords,
  DrawingCommand,
} from '@/app/lib/util/types';
import { clearCanvas } from '@/app/lib/util/image';
import { getObjectBoundaries } from '@/app/lib/util/selectorDrawingTool';
import { StrokeItem } from '../DrawingToolPalette/StrokeSelection/StrokeWidthSelector';
// TODO: find  way to reduce the number of arguments for all action functinos
export const mouseUpLineTool = (
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
    // TODO: find a more seamless way to do this.  drawingCommandFactory or whatever
    const command: DrawingCommand = {
      drawingTool: DrawingTool.Line,
      startX: startingCoords.startX,
      startY: startingCoords.startY,
      endX: lastCoords.lastX,
      endY: lastCoords.lastY,
      strokeWidth: selectedStrokeItem.strokeWidthPx,
      color: selectedColor,
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

    paintingSetter(false);
    startingCoordsSetter(null);
    lastCoordsSetter(null);

    clearCanvas(contextTemp, canvasWidth, canvasHeight);
  }
};

export const mouseMoveLineTool = (
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
    clearCanvas(contextTemp, canvasWidth, canvasHeight);
    contextTemp.strokeStyle = selectedColor;
    contextTemp.beginPath();
    contextTemp.moveTo(startingCoords.startX, startingCoords.startY);
    contextTemp.lineTo(currentX, currentY);
    contextTemp.lineWidth = selectedStrokeItem.strokeWidthPx;
    contextTemp.stroke();
  }
};

export const mouseDownLineTool = (
  currentX: number,
  currentY: number,
  paintingSetter: (paintingVal: boolean) => void,
  startingCoordsSetter: (coords: StartingCoords) => void
) => {
  startingCoordsSetter({ startX: currentX, startY: currentY });
  paintingSetter(true);
};
