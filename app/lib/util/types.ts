import { DrawingTool } from './enums';

export type StartingCoords = {
  startX: number;
  startY: number;
};

export type LastCoords = {
  lastX: number;
  lastY: number;
};

export type ObjectBoundaries = {
  leftX: number;
  rightX: number;
  topY: number;
  bottomY: number;
};

export type GetObjectBoundariesInputs = {
  toolType: DrawingTool;
  startX: number;
  startY: number;
  endX?: number;
  endY?: number;
  radius?: number;
};

// this will need so much more.  think about an abstract class with subclasses for each type of tool.
export type DrawingCommand = {
  drawingTool: DrawingTool;
  startX: number;
  startY: number;
  endX?: number;
  endY?: number;
  radius?: number;
  text?: string;
  selected?: boolean;
  objectBoundaries?: ObjectBoundaries; // TODO: make mandatory after implementations all completeß
};
