import { UnstyledDrawingCommand } from '@/app/lib/util/types';
import { TextInputState } from '../TextInput';
import { DrawingTool } from '@/app/lib/util/enums';
import { getObjectBoundaries } from '@/app/lib/util/selectorDrawingTool';

export const mouesDownTextTool = (
  currentX: number,
  currentY: number,
  textInputState: TextInputState,
  textInputStateSetter: (inputState: TextInputState) => void,
  addDrawingCommand: (command: UnstyledDrawingCommand) => void
) => {
  if (textInputState.active) {
    if (textInputState.value) {
      // TODO: get rid of this magic number for startY.  Right now this accounts for the coordinates anchoring an input's top left corner,
      // while they anchor the context fillText command's bottom left
      // this means we need to shift the fill command down, but not sure why 23 works.  it doesnt appear to be the height of
      // the text input (tried that, shifted too much), so is that the height of the font itself?
      // if so we need to understand the height between the border of the input and the texts element itself
      // or maybe we can get that coordinate directly.  see command in TextInput for more info
      const command: UnstyledDrawingCommand = {
        drawingTool: DrawingTool.Text,
        startX: textInputState.posX,
        startY: textInputState.posY + 23,
        text: textInputState.value,
      };

      const endX = command.startX + textInputState.width;
      const endY = command.startY + textInputState.height;
      // TODO: need to
      const objectBoundaries = getObjectBoundaries({
        toolType: command.drawingTool,
        startX: command.startX,
        startY: textInputState.posY,
        endX: endX,
        endY: endY,
      });
      command.objectBoundaries = objectBoundaries;

      addDrawingCommand(command);
    }
    // TODO: we shouldn't have to care about setting any details here.  may need a helper function
    textInputStateSetter({
      active: false,
      posX: textInputState.posX,
      posY: currentY,
      value: '',
      width: 0,
      height: 0,
    });
    return;
  }
  // TODO: we shouldn't care about setting width, height, and value here.  may need a helper function
  textInputStateSetter({
    active: true,
    posX: currentX,
    posY: currentY,
    value: '',
    width: 0,
    height: 0,
  });
};
