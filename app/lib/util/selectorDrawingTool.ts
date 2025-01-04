import { DrawingTool } from './enums';
import {
  DrawingCommand,
  GetObjectBoundariesInputs,
  ObjectBoundaries,
} from './types';

const MIN_DIM_PX = 30;
// TODO: support remaining tool types
export const getObjectBoundaries = (
  inputs: GetObjectBoundariesInputs
): ObjectBoundaries => {
  switch (inputs.toolType) {
    case DrawingTool.Line:
    case DrawingTool.Text:
    case DrawingTool.Rectangle:
      if (inputs.endX && inputs.endY) {
        const boundaries = getBoundariesFromStartAndEndCoords(
          inputs.startX,
          inputs.startY,
          inputs.endX,
          inputs.endY
        );
        return boundaries;
      }
    case DrawingTool.RadiusedCircle:
      if (inputs.radius != undefined) {
        const boundaries = getRadiusedCircleBoundaries(
          inputs.startX,
          inputs.startY,
          inputs.radius
        );
        return boundaries;
      }
    default:
      throw Error(
        `getObjectBoundaries does not handle object type ${inputs.toolType}.  Received inputs: ${JSON.stringify(inputs)}`
      );
  }
};

const getBoundariesFromStartAndEndCoords = (
  startX: number,
  startY: number,
  endX: number,
  endY: number
): ObjectBoundaries => {
  const leftX = Math.min(startX, endX);
  const rightX = Math.max(startX, endX);
  const topY = Math.min(startY, endY);
  const bottomY = Math.max(startY, endY);

  const { newLeftX, newRightX, newTopY, newBottomY } =
    resizeBounadiresToRespectMinimums(leftX, rightX, topY, bottomY);

  return {
    leftX: newLeftX,
    rightX: newRightX,
    topY: newTopY,
    bottomY: newBottomY,
  };
};

const getRadiusedCircleBoundaries = (
  startX: number,
  startY: number,
  radius: number
): ObjectBoundaries => {
  const initialLeftX = startX - radius;
  const initialRightX = startX + radius;
  const initialTopY = startY - radius;
  const initialBottomY = startY + radius;

  const {
    newLeftX: leftX,
    newRightX: rightX,
    newTopY: topY,
    newBottomY: bottomY,
  } = resizeBounadiresToRespectMinimums(
    initialLeftX,
    initialRightX,
    initialTopY,
    initialBottomY
  );

  return { leftX, rightX, topY, bottomY };
};

const resizeBounadiresToRespectMinimums = (
  leftX: number,
  rightX: number,
  topY: number,
  bottomY: number
) => {
  const { newSmallerDim: newLeftX, newLargerDim: newRightX } =
    resizeBoundaryToRespectMinimuims(leftX, rightX);
  const { newSmallerDim: newTopY, newLargerDim: newBottomY } =
    resizeBoundaryToRespectMinimuims(topY, bottomY);

  return { newLeftX, newRightX, newTopY, newBottomY };
};

const resizeBoundaryToRespectMinimuims = (
  smallerDim: number,
  largerDim: number
) => {
  let newSmallerDim = smallerDim;
  let newLargerDim = largerDim;
  const currentDelta = largerDim - smallerDim;
  if (currentDelta < MIN_DIM_PX) {
    let pxToChangeToRespectMin = MIN_DIM_PX - currentDelta;
    if (pxToChangeToRespectMin % 2 != 0) {
      pxToChangeToRespectMin += 1;
    }

    const pxToChangePerSide = pxToChangeToRespectMin / 2;

    newSmallerDim = smallerDim - pxToChangePerSide;
    newLargerDim = largerDim + pxToChangePerSide;
  }
  return { newSmallerDim, newLargerDim };
};

export const selectionIsInObject = (
  command: DrawingCommand,
  posX: number,
  posY: number
) => {
  if (command.objectBoundaries) {
    const boundaries = command.objectBoundaries;
    return (
      posX >= boundaries.leftX &&
      posX <= boundaries.rightX &&
      posY >= boundaries.topY &&
      posY <= boundaries.bottomY
    );
  }
};
