import React, { useEffect, useState } from 'react';
import { DrawingTool } from '../util/enums';
import {
  StartingCoords,
  LastCoords,
  StyledDrawingCommand,
  UnstyledDrawingCommand,
} from '../util/types';
import {
  DrawingToolEventListenerCoordinator,
  DrawingToolEventListenerCoordinatorArgs,
} from '@/app/ui/ImageUploadAndEditor/ImageEditor/classes/DrawingToolEventListenerCoordinator';
import { useTextInput } from './useTextInput';
import { useSelectionOnCanvas } from './useSelectionOnCanvas';
import { drawingToolListenerCoordinatorFactory } from '@/app/ui/ImageUploadAndEditor/ImageEditor/classes/DrawingToolEventListenerCoordinatorFactory';

export const useDrawingTool = ({
  canvasRefPerm,
  canvasRefTemp,
  activeTool,
  drawCommands,
  addDrawingCommand,
  drawCommandsSetter,
  tempDrawCommandSetter,
  handleCommandSelectionByIndex,
  handleSelectedCommandDrag,
  handleCommandUnselect,
}: {
  canvasRefPerm: React.RefObject<HTMLCanvasElement>;
  canvasRefTemp: React.RefObject<HTMLCanvasElement>;
  activeTool: DrawingTool | null;
  drawCommands: StyledDrawingCommand[];
  addDrawingCommand: (command: UnstyledDrawingCommand) => void;
  drawCommandsSetter: (commands: StyledDrawingCommand[]) => void;
  tempDrawCommandSetter: (command: UnstyledDrawingCommand) => void;
  handleCommandSelectionByIndex: (index: number) => void;
  handleSelectedCommandDrag: (deltaX: number, deltaY: number) => void;
  handleCommandUnselect: () => void;
}) => {
  const [startingCoords, setStartingCoords] = useState<StartingCoords | null>(
    null
  );
  const [painting, setPainting] = useState<boolean>(false);
  const [lastCoords, setLastCoords] = useState<LastCoords | null>(null);

  const setTempDrawCommandAndLastCoords = (
    command: UnstyledDrawingCommand,
    lastX: number,
    lastY: number
  ) => {
    setLastCoords({ lastX: lastX, lastY: lastY });

    tempDrawCommandSetter(command);
  };

  const mouseDownHandlerForToolsWithPreview = (coords: StartingCoords) => {
    setStartingCoords({ startX: coords.startX, startY: coords.startY });
    setLastCoords({ lastX: coords.startX, lastY: coords.startY });
    setPainting(true);
  };

  const {
    textInputStateSetter,
    textInputValueSetter,
    textInputSizeSetter,
    textInputState,
  } = useTextInput();
  const {
    selectOnCanvas,
    handleDragOnCanvas,
    unSelectOnCanvas,
    dragInProgress,
    startDragOnCanvas,
  } = useSelectionOnCanvas({
    drawCommands: drawCommands,
    handleCommandSelectionByIndex: handleCommandSelectionByIndex,
    handleSelectedCommandDrag: handleSelectedCommandDrag,
    handleCommandUnselect: handleCommandUnselect,
    selectedDrawingTool: activeTool,
  });

  useEffect(() => {
    if (canvasRefPerm.current && canvasRefTemp.current && activeTool) {
      const canvasPerm = canvasRefPerm.current;
      const contextPerm = canvasPerm.getContext('2d');

      const canvasTemp = canvasRefTemp.current;
      const contextTemp = canvasTemp.getContext('2d');

      const rect = canvasPerm.getBoundingClientRect();

      if (contextPerm && contextTemp) {
        const args: DrawingToolEventListenerCoordinatorArgs = {
          drawingTool: activeTool,
          canvasPerm: canvasPerm,
          rect: rect,
          startingCoords: startingCoords,
          lastCoords: lastCoords,
          painting: painting,
          addDrawingCommand: addDrawingCommand,
          textInputState: textInputState,
          textInputStateSetter: textInputStateSetter,
          selectOnCanvas: selectOnCanvas,
          dragInProgress: dragInProgress,
          handleDragOnCanvas: handleDragOnCanvas,
          unSelectOnCanvas: unSelectOnCanvas,
          mouseDownHandlerForToolsWithPreview:
            mouseDownHandlerForToolsWithPreview,
          setTempDrawCommandAndLastCoords: setTempDrawCommandAndLastCoords,
          startDragOnCanvas: startDragOnCanvas,
        };

        const coordinator: DrawingToolEventListenerCoordinator =
          drawingToolListenerCoordinatorFactory(args);

        coordinator.addEventListenersToPermCanvas();

        return () => {
          coordinator.removeEventListenersFromPermCanvas();
        };
      }
    }
  }, [
    activeTool,
    painting,
    startingCoords,
    lastCoords,
    drawCommands,
    textInputState.active,
    textInputState.value,
  ]);

  // make sure text input is not visible when it shouldn't be
  useEffect(() => {
    if (activeTool != DrawingTool.Text && textInputState.active) {
      textInputStateSetter({ ...textInputState, active: false });
    }
  }, [textInputState.active, activeTool]);

  // clean up when a command is added or removed
  useEffect(() => {
    setPainting(false);
    setStartingCoords(null);
    setLastCoords(null);
  }, [drawCommands.length]);

  return {
    textInputState,
    textInputValueSetter,
    textInputSizeSetter,
  };
};
