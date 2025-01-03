import React, { useEffect, useState } from 'react';
import { DrawingTool } from '../util/enums';
import { StartingCoords, LastCoords, DrawingCommand } from '../util/types';
import {
  DrawingToolEventListenerCoordinator,
  DrawingToolEventListenerCoordinatorArgs,
  drawingToolListenerCoordinatorFactory,
} from '@/app/ui/ImageUploadAndEditor/ImageEditor/classes/DrawingToolEventListenerCoordinator';
import { useTextInput } from './useTextInput';
import { useSelectionOnCanvas } from './useSelectionOnCanvas';
import { StrokeItem } from '@/app/ui/ImageUploadAndEditor/ImageEditor/DrawingToolPalette/StrokeWidthSelector';

export const useDrawingTool = ({
  canvasRefPerm,
  canvasRefTemp,
  activeTool,
  canvasWidth,
  canvasHeight,
  drawCommands,
  addDrawingCommand,
  drawCommandsSetter,
  selectedStrokeItem,
}: {
  canvasRefPerm: React.RefObject<HTMLCanvasElement>;
  canvasRefTemp: React.RefObject<HTMLCanvasElement>;
  activeTool: DrawingTool | null;
  canvasWidth: number;
  canvasHeight: number;
  drawCommands: DrawingCommand[];
  addDrawingCommand: (command: DrawingCommand) => void;
  drawCommandsSetter: (commands: DrawingCommand[]) => void;
  selectedStrokeItem: StrokeItem;
}) => {
  const [startingCoords, setStartingCoords] = useState<StartingCoords | null>(
    null
  );
  const [painting, setPainting] = useState<boolean>(false);
  const [lastCoords, setLastCoords] = useState<LastCoords | null>(null);

  // TODO: this should be something like "finishDraw" which cleans up starting and last coordinates as well as painting
  const paintingSetter = (paintingVal: boolean) => {
    setPainting(paintingVal);
  };

  const startingCoordsSetter = (coords: StartingCoords | null) => {
    setStartingCoords(coords);
  };

  const lastCoordsSetter = (coords: LastCoords | null) => {
    setLastCoords(coords);
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
  } = useSelectionOnCanvas({
    drawCommands: drawCommands,
    drawCommandsSetter: drawCommandsSetter,
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
          contextPerm: contextPerm,
          contextTemp: contextTemp,
          rect: rect,
          startingCoords: startingCoords,
          lastCoords: lastCoords,
          canvasWidth: canvasWidth,
          canvasHeight: canvasHeight,
          painting: painting,
          addDrawingCommand: addDrawingCommand,
          paintingSetter: paintingSetter,
          startingCoordsSetter: startingCoordsSetter,
          lastCoordsSetter: lastCoordsSetter,
          textInputState: textInputState,
          textInputStateSetter: textInputStateSetter,
          selectOnCanvas: selectOnCanvas,
          dragInProgress: dragInProgress,
          handleDragOnCanvas: handleDragOnCanvas,
          unSelectOnCanvas: unSelectOnCanvas,
          selectedStrokeItem: selectedStrokeItem,
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

  return { textInputState, textInputValueSetter, textInputSizeSetter };
};
