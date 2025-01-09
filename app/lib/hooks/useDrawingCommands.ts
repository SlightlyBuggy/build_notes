import { useEffect, useState } from 'react';
import { StyledDrawingCommand, UnstyledDrawingCommand } from '../util/types';
import { drawCommandExecutorFactory } from '@/app/ui/ImageUploadAndEditor/ImageEditor/classes/DrawingToolCommandExecutor';
import { StrokeItem } from '@/app/ui/ImageUploadAndEditor/ImageEditor/DrawingToolPalette/StrokeSelection/StrokeWidthSelector';

export const useDrawingCommands = (
  canvasRefPerm: React.RefObject<HTMLCanvasElement>,
  canvasRefTemp: React.RefObject<HTMLCanvasElement>,
  selectedColor: string,
  selectedStrokeItem: StrokeItem
) => {
  const [drawCommands, setDrawCommands] = useState<StyledDrawingCommand[]>([]);
  const [tempDrawCommand, setTemptDrawCommand] =
    useState<StyledDrawingCommand>();
  const [undoneDrawCommands, setUndoneDrawCommands] = useState<
    StyledDrawingCommand[]
  >([]);

  const drawCommandsSetter = (commands: StyledDrawingCommand[]) => {
    setDrawCommands(commands);
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
    const styledCommand: StyledDrawingCommand = {
      ...command,
      color: selectedColor,
      strokeWidth: selectedStrokeItem.strokeWidthPx,
    };
    setDrawCommands([...drawCommands, styledCommand]);
    // when a new command is added, we clear the list of undone commands.  otherwise things could get confusing for the user.
    setUndoneDrawCommands([]);
  };

  const undoLastDrawingCommand = () => {
    const currentCommands = [...drawCommands];
    const lastCommand: StyledDrawingCommand | undefined = currentCommands.pop();
    if (lastCommand) {
      setUndoneDrawCommands([...undoneDrawCommands, lastCommand]);
      setDrawCommands(currentCommands);
    }
  };

  const redoLastUndoneCommand = () => {
    const currentUndoneCommands = [...undoneDrawCommands];
    const commandToRedo = currentUndoneCommands.pop();
    if (commandToRedo) {
      setDrawCommands([...drawCommands, commandToRedo]);
      setUndoneDrawCommands(currentUndoneCommands);
    }
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
    if (canvasRefTemp.current) {
      const canvasTemp = canvasRefTemp.current;
      const contextTemp = canvasTemp.getContext('2d');

      if (contextTemp && tempDrawCommand) {
        clearTempCanvas();

        const drawCommandExecutor = drawCommandExecutorFactory(
          tempDrawCommand,
          contextTemp
        );
        drawCommandExecutor.executeCommand();
      }
    }
  }, [tempDrawCommand]);

  // handle drawing commands on permanent canvas
  useEffect(() => {
    // when draw commands change, clear canvas and replay all commands
    if (canvasRefPerm.current) {
      const canvasPerm = canvasRefPerm.current;
      const contextPerm = canvasPerm.getContext('2d');

      const rect = canvasPerm.getBoundingClientRect();

      if (contextPerm) {
        contextPerm.clearRect(0, 0, rect.width, rect.height);

        for (let command of drawCommands) {
          const drawCommandExecutor = drawCommandExecutorFactory(
            command,
            contextPerm
          );
          drawCommandExecutor.executeCommand();
        }
      }
    }
  }, [drawCommands]);

  return {
    drawCommands,
    undoneDrawCommands,
    addDrawingCommand,
    drawCommandsSetter,
    undoLastDrawingCommand,
    redoLastUndoneCommand,
    tempDrawCommandSetter,
  };
};
