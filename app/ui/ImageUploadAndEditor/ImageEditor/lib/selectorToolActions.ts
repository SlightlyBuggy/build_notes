export const mouseDownSelectorTool = (
  currentX: number,
  currentY: number,
  selectOnCanvas: (posX: number, posY: number) => void
) => {
  selectOnCanvas(currentX, currentY);
};

export const mouseMoveSelectorTool = (
  currentX: number,
  currentY: number,
  dragInProgress: boolean,
  handleDragOnCanvas: (posX: number, posY: number) => void
) => {
  if (dragInProgress) {
    handleDragOnCanvas(currentX, currentY);
  }
};

export const mouseUpSelectorTool = (unSelectOnCanvas: () => void) => {
  unSelectOnCanvas();
};
