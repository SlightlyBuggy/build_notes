import {
  LastCoords,
  StartingCoords,
  UnstyledDrawingCommand,
} from '@/app/lib/util/types';
import {
  DrawingToolEventListenerCoordinator,
  DrawingToolEventListenerCoordinatorArgs,
  EventTypes,
  getCurrentCoords,
} from './DrawingToolEventListenerCoordinator';
import { DrawingTool } from '@/app/lib/util/enums';
import { getObjectBoundaries } from '@/app/lib/util/selectorDrawingTool';
import { TextInputState } from '../TextInput';

export class TextToolListenerCoordinator extends DrawingToolEventListenerCoordinator {
  constructor(args: DrawingToolEventListenerCoordinatorArgs) {
    super(args);

    this.textInputState = args.textInputState;
    this.textInputStateSetter = args.textInputStateSetter;

    this.createEventListenersWithHandlers();
  }
  private textInputState: TextInputState;
  private textInputStateSetter: (inputState: TextInputState) => void;

  protected createEventListenersWithHandlers = () => {
    this.eventsWithHandlers.push({
      eventType: EventTypes.MouseDown,
      eventListener: this.mouseDownListener,
    });
  };

  private mouseDownListener = (ev: MouseEvent) => {
    ev.preventDefault();
    const { currentX, currentY } = getCurrentCoords(ev, this.rect);

    // if already active, need to process value and set to inactive
    if (this.textInputState.active) {
      if (this.textInputState.value) {
        // TODO: get rid of this magic number for startY so we can support more font sizes.  Right now this accounts for the coordinates anchoring an input's top left corner,
        // while they anchor the context fillText command's bottom left
        // this means we need to shift the fill command down, but not sure why 22 works.  it doesnt appear to be the height of
        // the text input (tried that, shifted too much), so is that the height of the font itself?
        // if so we need to understand the height between the border of the input and the texts element itself
        // or maybe we can get that coordinate directly.  see command in TextInput for more info
        const command: UnstyledDrawingCommand = {
          drawingTool: DrawingTool.Text,
          startX: this.textInputState.posX,
          startY: this.textInputState.posY + 22,
          text: this.textInputState.value,
          selected: false,
        };

        const endX = command.startX + this.textInputState.width;
        const endY = command.startY + this.textInputState.height;
        // TODO: need to
        const objectBoundaries = getObjectBoundaries({
          toolType: command.drawingTool,
          startX: command.startX,
          startY: this.textInputState.posY,
          endX: endX,
          endY: endY,
        });
        command.objectBoundaries = objectBoundaries;

        this.addDrawingCommand(command);
      }
      // TODO: we shouldn't have to care about setting any details here.  may need a helper function
      this.textInputStateSetter({
        active: false,
        posX: this.textInputState.posX,
        posY: currentY,
        value: '',
        width: 0,
        height: 0,
      });
      return;
    }
    // TODO: we shouldn't care about setting width, height, and value here.  may need a helper function
    this.textInputStateSetter({
      active: true,
      posX: currentX,
      posY: currentY,
      value: '',
      width: 0,
      height: 0,
    });
  };
}
