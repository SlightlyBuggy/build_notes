import { useState } from 'react';
import { StyledDrawingCommand } from '../util/types';
import { selectionIsInObject } from '../util/selectorDrawingTool';

export const useSelectionOnCanvas = ({
  drawCommands,
  handleCommandSelectionByIndex,
  handleSelectedCommandDrag,
  handleCommandUnselect,
}: {
  drawCommands: StyledDrawingCommand[];
  handleCommandSelectionByIndex: (index: number) => void;
  handleSelectedCommandDrag: (deltaX: number, deltaY: number) => void;
  handleCommandUnselect: () => void;
}) => {
  const [mouseLastCoords, setMouseLastCoords] = useState<{
    lastX: number;
    lastY: number;
  }>();
  const [dragInProgress, setDragInProgress] = useState<boolean>(false);

  const selectOnCanvas = (posX: number, posY: number) => {
    drawCommands.forEach((command, idx) => {
      const commandSelected = selectionIsInObject(command, posX, posY);

      if (commandSelected) {
        handleCommandSelectionByIndex(idx);
        setMouseLastCoords({ lastX: posX, lastY: posY });
        setDragInProgress(true);
      } else {
        console.log(`Selection is not in a command`);
      }
    });
  };

  const handleDragOnCanvas = (posX: number, posY: number) => {
    if (mouseLastCoords) {
      const deltaX = posX - mouseLastCoords.lastX;
      const deltaY = posY - mouseLastCoords.lastY;

      handleSelectedCommandDrag(deltaX, deltaY);
      setMouseLastCoords({ lastX: posX, lastY: posY });
    }
  };

  const unSelectOnCanvas = () => {
    handleCommandUnselect();
    setDragInProgress(false);
  };

  return {
    selectOnCanvas,
    handleDragOnCanvas,
    unSelectOnCanvas,
    dragInProgress,
  };
};
