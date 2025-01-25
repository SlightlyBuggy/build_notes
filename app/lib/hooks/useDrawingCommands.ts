import { useEffect, useState } from 'react';
import { StyledDrawingCommand, UnstyledDrawingCommand } from '../util/types';
import { drawCommandExecutorFactory } from '@/app/ui/ImageUploadAndEditor/ImageEditor/classes/DrawingToolCommandExecutor';
import { StrokeItem } from '@/app/ui/ImageUploadAndEditor/ImageEditor/DrawingToolPalette/StrokeSelection/StrokeWidthSelector';
import { DrawingTool } from '../util/enums';

export const useDrawingCommands = (
  canvasRefPerm: React.RefObject<HTMLCanvasElement>,
  canvasRefTemp: React.RefObject<HTMLCanvasElement>,
  selectedColor: string,
  selectedStrokeItem: StrokeItem
) => {
  const [drawCommandsHistory, setDrawCommandsHistory] = useState<
    Array<StyledDrawingCommand[]>
  >([[]]);

  const [tempDrawCommand, setTemptDrawCommand] =
    useState<StyledDrawingCommand>();

  const [undoneDrawCommandHistories, setUndoneDrawCommandHistories] = useState<
    Array<StyledDrawingCommand[]>
  >([]);

  const [selectedDrawCommandIndex, setSelectedDrawCommandIndex] = useState<
    number | null
  >(null);

  const getLatestDrawCommandsCopy = (): StyledDrawingCommand[] => {
    const latestHistory =
      (drawCommandsHistory.length &&
        drawCommandsHistory[drawCommandsHistory.length - 1]) ||
      [];
    return JSON.parse(JSON.stringify(latestHistory));
  };

  const addDrawCommandListToHistory = (newCommands: StyledDrawingCommand[]) => {
    const newDrawCommandsHistory = [...drawCommandsHistory, newCommands];
    setDrawCommandsHistory(newDrawCommandsHistory);
  };

  const drawCommandsSetter = (commands: StyledDrawingCommand[]) => {
    // setDrawCommands(commands);
    addDrawCommandListToHistory(commands);
  };

  // on selection, make a new history
  const handleCommandSelectionByIndex = (index: number) => {
    const newHistory = getLatestDrawCommandsCopy();
    setDrawCommandsHistory([...drawCommandsHistory, newHistory]);

    setSelectedDrawCommandIndex(index);
  };

  // on movement, replace the latest history with a new one with updated coordinates for the selected command
  const handleSelectedCommandDrag = (deltaX: number, deltaY: number) => {
    const latestCommandsCopy = getLatestDrawCommandsCopy();
    if (selectedDrawCommandIndex != null) {
      const command = latestCommandsCopy[selectedDrawCommandIndex];
      command.startX += deltaX;
      command.startY += deltaY;

      if (command.endX !== undefined) {
        command.endX += deltaX;
      }

      if (command.endY !== undefined) {
        command.endY += deltaY;
      }

      if (command.objectBoundaries) {
        command.objectBoundaries.leftX += deltaX;
        command.objectBoundaries.rightX += deltaX;

        command.objectBoundaries.bottomY += deltaY;
        command.objectBoundaries.topY += deltaY;
      }
    }

    // replace the current latest history with the one new one with updated coordinates
    const drawCommandHistoryCopy = JSON.parse(
      JSON.stringify(drawCommandsHistory)
    );
    drawCommandHistoryCopy[drawCommandHistoryCopy.length - 1] =
      latestCommandsCopy;

    setDrawCommandsHistory(drawCommandHistoryCopy);
  };

  // handle unselection of object
  const handleCommandUnselect = () => {
    const drawCommandHistoryCopy: StyledDrawingCommand[][] = JSON.parse(
      JSON.stringify(drawCommandsHistory)
    );
    // remove the latest history if it exactly matches the one prior
    // this happens on select/unselect but no drag
    removeLastHistorIfNoChange(drawCommandHistoryCopy);

    setDrawCommandsHistory(drawCommandHistoryCopy);

    setSelectedDrawCommandIndex(null);
  };

  const removeLastHistorIfNoChange = (
    drawCommandHistoryCopy: StyledDrawingCommand[][]
  ) => {
    if (drawCommandHistoryCopy.length >= 3) {
      const latestDrawCommandHistory = getLatestDrawCommandsCopy();
      const latestMinusOneDrawCommandHistory =
        drawCommandHistoryCopy[drawCommandsHistory.length - 2];

      if (
        JSON.stringify(latestMinusOneDrawCommandHistory) ==
        JSON.stringify(latestDrawCommandHistory)
      ) {
        drawCommandHistoryCopy.pop();
      }
    }
  };

  const tempDrawCommandSetter = (command: UnstyledDrawingCommand) => {
    const styledCommand: StyledDrawingCommand = {
      ...command,
      color: selectedColor,
      strokeWidth: selectedStrokeItem.strokeWidthPx,
    };

    setTemptDrawCommand(styledCommand);
  };

  const addDrawingCommand = (command: UnstyledDrawingCommand) => {
    // validate the command.  if it was just a click, then we can ignore
    let commandIsValid = true;
    switch (command.drawingTool) {
      case DrawingTool.Line:
      case DrawingTool.Rectangle:
        if (command.startX == command.endX && command.startY == command.endY) {
          commandIsValid = false;
        }
        break;
      case DrawingTool.RadiusedCircle:
        if (command.radius === 0) {
          commandIsValid = false;
        }
    }
    if (commandIsValid) {
      const styledCommand: StyledDrawingCommand = {
        ...command,
        color: selectedColor,
        strokeWidth: selectedStrokeItem.strokeWidthPx,
      };

      const latestDrawCommands = getLatestDrawCommandsCopy();
      addDrawCommandListToHistory([...latestDrawCommands, styledCommand]);
      setUndoneDrawCommandHistories([]);
    }
  };

  const undoLastDrawingCommand = () => {
    const drawCommandHistoryCopy = JSON.parse(
      JSON.stringify(drawCommandsHistory)
    );

    // we might have a no-change history if an item has been selected but no drag has happened
    removeLastHistorIfNoChange(drawCommandHistoryCopy);

    const lastHistory: StyledDrawingCommand[] | undefined =
      drawCommandHistoryCopy.pop();
    if (lastHistory) {
      setUndoneDrawCommandHistories([
        ...undoneDrawCommandHistories,
        lastHistory,
      ]);
      setDrawCommandsHistory(drawCommandHistoryCopy);
    }

    setSelectedDrawCommandIndex(null);
  };

  const redoLastUndoneCommand = () => {
    const undoneDrawCommandHistoriesCopy = JSON.parse(
      JSON.stringify(undoneDrawCommandHistories)
    );
    const historyToRedo = undoneDrawCommandHistoriesCopy.pop();
    if (historyToRedo) {
      setDrawCommandsHistory([...drawCommandsHistory, historyToRedo]);
      setUndoneDrawCommandHistories(undoneDrawCommandHistoriesCopy);
    }

    setSelectedDrawCommandIndex(null);
  };

  const clearTempCanvas = () => {
    const canvasTemp = canvasRefTemp.current;
    if (canvasTemp) {
      const contextTemp = canvasTemp.getContext('2d');

      if (contextTemp) {
        const rect = canvasTemp.getBoundingClientRect();
        contextTemp.clearRect(0, 0, rect.width, rect.height);
      }
    }
  };

  const clearPermCanvas = () => {
    const canvasPerm = canvasRefPerm.current;
    if (canvasPerm) {
      const contextPerm = canvasPerm.getContext('2d');

      if (contextPerm) {
        const rect = canvasPerm.getBoundingClientRect();
        contextPerm.clearRect(0, 0, rect.width, rect.height);
      }
    }
  };

  // hanadle drawing command on temp canvas
  useEffect(() => {
    clearTempCanvas();

    if (canvasRefTemp.current) {
      const canvasTemp = canvasRefTemp.current;
      const contextTemp = canvasTemp.getContext('2d');

      if (contextTemp && tempDrawCommand) {
        const drawCommandExecutor = drawCommandExecutorFactory(
          tempDrawCommand,
          contextTemp,
          false
        );
        drawCommandExecutor.executeCommand();
      }
    }
  }, [tempDrawCommand]);

  // draw when the command history changes
  useEffect(() => {
    // when draw commands change, clear canvases and replay all commands
    clearPermCanvas();
    clearTempCanvas();
    executeDrawCommands();
  }, [drawCommandsHistory.length]);

  useEffect(() => {
    clearPermCanvas();
    clearTempCanvas();
    executeDrawCommands();
  }, [drawCommandsHistory[drawCommandsHistory.length - 1]]);

  const executeDrawCommands = () => {
    if (canvasRefPerm.current) {
      const canvasPerm = canvasRefPerm.current;
      const contextPerm = canvasPerm.getContext('2d');

      if (contextPerm) {
        const latestDrawCommands = getLatestDrawCommandsCopy();

        latestDrawCommands.forEach((command, index) => {
          const drawCommandExecutor = drawCommandExecutorFactory(
            command,
            contextPerm,
            index === selectedDrawCommandIndex
          );
          drawCommandExecutor.executeCommand();
        });
      }
    }
  };

  const handleDeleteButtonPressed = () => {
    const latestDrawCommandsCopy = getLatestDrawCommandsCopy();

    if (selectedDrawCommandIndex != null) {
      setUndoneDrawCommandHistories([
        ...undoneDrawCommandHistories,
        JSON.parse(JSON.stringify(latestDrawCommandsCopy)),
      ]);

      latestDrawCommandsCopy.splice(selectedDrawCommandIndex, 1);

      addDrawCommandListToHistory(latestDrawCommandsCopy);

      setSelectedDrawCommandIndex(null);
    }
  };
  return {
    drawCommands: getLatestDrawCommandsCopy(),
    undoneDrawCommandHistories,
    addDrawingCommand,
    drawCommandsSetter,
    undoLastDrawingCommand,
    redoLastUndoneCommand,
    tempDrawCommandSetter,
    executeDrawCommands,
    clearPermCanvas,
    handleCommandSelectionByIndex,
    handleSelectedCommandDrag,
    handleCommandUnselect,
    handleDeleteButtonPressed,
  };
};
