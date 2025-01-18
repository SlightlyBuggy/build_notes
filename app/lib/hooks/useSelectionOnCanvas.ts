import { useEffect, useState } from 'react';
import { StyledDrawingCommand } from '../util/types';
import { selectionIsInObject } from '../util/selectorDrawingTool';
import { DrawingTool } from '../util/enums';

export const useSelectionOnCanvas = ({
  drawCommands,
  handleCommandSelectionByIndex,
  handleSelectedCommandDrag,
  handleCommandUnselect,
  selectedDrawingTool,
}: {
  drawCommands: StyledDrawingCommand[];
  handleCommandSelectionByIndex: (index: number) => void;
  handleSelectedCommandDrag: (deltaX: number, deltaY: number) => void;
  handleCommandUnselect: () => void;
  selectedDrawingTool: DrawingTool | null;
}) => {
  const [mouseLastCoords, setMouseLastCoords] = useState<{
    lastX: number;
    lastY: number;
  }>();
  const [dragInProgress, setDragInProgress] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  // TODO: pull loops into getObjectInCoords(posX, posY)
  const selectOnCanvas = (posX: number, posY: number) => {
    // if an object is already selected, unselect if selection is outside it
    // TODO: later expand to allow selection of object drawn earlier in history
    if (selectedIndex) {
      const selectionInObject = selectionIsInObject(
        drawCommands[selectedIndex],
        posX,
        posY
      );
      if (!selectionInObject) {
        unSelectOnCanvas();
      }
    } else {
      // if an object is not selected, select the object
      for (let i = drawCommands.length - 1; i >= 0; i--) {
        const commandSelected = selectionIsInObject(
          drawCommands[i],
          posX,
          posY
        );
        if (commandSelected) {
          handleCommandSelectionByIndex(i);
          setSelectedIndex(i);
          break;
        }
      }
    }
  };

  const startDragOnCanvas = (posX: number, posY: number) => {
    // when an object is already selected, drag applies only if we are in that object
    if (selectedIndex != null) {
      const coordsInSelectedObject = selectionIsInObject(
        drawCommands[selectedIndex],
        posX,
        posY
      );
      if (coordsInSelectedObject) {
        console.log('Startind drag in progress');
        setMouseLastCoords({ lastX: posX, lastY: posY });
        setDragInProgress(true);
      }
    } else {
      // otherwise, we can see if we are in an object, and if so, select and start drag
      for (let i = drawCommands.length - 1; i >= 0; i--) {
        const commandSelected = selectionIsInObject(
          drawCommands[i],
          posX,
          posY
        );
        if (commandSelected) {
          handleCommandSelectionByIndex(i);
          setSelectedIndex(i);
          setMouseLastCoords({ lastX: posX, lastY: posY });
          setDragInProgress(true);
          break;
        }
      }
    }
  };

  useEffect(() => {
    unSelectOnCanvas();
  }, [selectedDrawingTool]);

  const handleDragOnCanvas = (posX: number, posY: number) => {
    if (dragInProgress && mouseLastCoords) {
      const deltaX = posX - mouseLastCoords.lastX;
      const deltaY = posY - mouseLastCoords.lastY;

      handleSelectedCommandDrag(deltaX, deltaY);
      setMouseLastCoords({ lastX: posX, lastY: posY });
    }
  };

  const unSelectOnCanvas = () => {
    handleCommandUnselect();
    setSelectedIndex(null);
    setDragInProgress(false);
  };

  return {
    selectOnCanvas,
    handleDragOnCanvas,
    unSelectOnCanvas,
    dragInProgress,
    startDragOnCanvas,
  };
};
