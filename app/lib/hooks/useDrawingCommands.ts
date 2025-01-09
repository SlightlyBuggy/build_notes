import { useEffect, useState } from 'react';
import { DrawingCommand } from '../util/types';
import { drawCommandExecutorFactory } from '@/app/ui/ImageUploadAndEditor/ImageEditor/classes/DrawingToolCommandExecutor';

export const useDrawingCommands = (
  canvasRefPerm: React.RefObject<HTMLCanvasElement>,
  canvasRefTemp: React.RefObject<HTMLCanvasElement>
) => {
  const [drawCommands, setDrawCommands] = useState<DrawingCommand[]>([]);
  const [tempDrawCommand, setTemptDrawCommand] = useState<DrawingCommand>();
  const [undoneDrawCommands, setUndoneDrawCommands] = useState<
    DrawingCommand[]
  >([]);

  const drawCommandsSetter = (commands: DrawingCommand[]) => {
    setDrawCommands(commands);
  };

  const tempDrawCommandSetter = (command: DrawingCommand) => {
    setTemptDrawCommand(command);
  };

  const addDrawingCommand = (command: DrawingCommand) => {
    setDrawCommands([...drawCommands, command]);
    // when a new command is added, we clear the list of undone commands.  otherwise things could get confusing for the user.
    setUndoneDrawCommands([]);
  };

  const undoLastDrawingCommand = () => {
    const currentCommands = [...drawCommands];
    const lastCommand: DrawingCommand | undefined = currentCommands.pop();
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

  // hanadle drawing command on temp canvas
  useEffect(() => {
    if (canvasRefTemp.current) {
      const canvasTemp = canvasRefTemp.current;
      const contextTemp = canvasTemp.getContext('2d');

      const rect = canvasTemp.getBoundingClientRect();

      if (contextTemp && tempDrawCommand) {
        contextTemp.clearRect(0, 0, rect.width, rect.height);

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
