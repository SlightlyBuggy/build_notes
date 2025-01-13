import {
  UnstyledDrawingCommand,
  LastCoords,
  StartingCoords,
} from '@/app/lib/util/types';
import { DrawingTool } from '@/app/lib/util/enums';
import { TextInputState } from '../TextInput';

export interface DrawingToolEventListenerCoordinatorArgs {
  drawingTool: DrawingTool;
  canvasPerm: HTMLCanvasElement;
  rect: DOMRect;
  startingCoords: StartingCoords | null;
  lastCoords: LastCoords | null;
  painting: boolean;
  addDrawingCommand: (command: UnstyledDrawingCommand) => void;
  textInputState: TextInputState;
  textInputStateSetter: (inputState: TextInputState) => void;
  selectOnCanvas: (posX: number, posY: number) => void;
  dragInProgress: boolean;
  handleDragOnCanvas: (posX: number, posY: number) => void;
  unSelectOnCanvas: () => void;
  mouseDownHandlerForToolsWithPreview: (coords: StartingCoords) => void;
  setTempDrawCommandAndLastCoords: (
    command: UnstyledDrawingCommand,
    lastX: number,
    lastY: number
  ) => void;
}

interface EventTypeWithListener {
  eventListener: (ev: MouseEvent) => void;
  eventType: EventTypes;
}

export enum EventTypes {
  MouseDown = 'mousedown',
  MouseUp = 'mouseup',
  MouseMove = 'mousemove',
}

export abstract class DrawingToolEventListenerCoordinator {
  constructor(args: DrawingToolEventListenerCoordinatorArgs) {
    const { canvasPerm, rect, addDrawingCommand } = args;
    this.canvasPerm = canvasPerm;
    this.rect = rect;
    this.addDrawingCommand = addDrawingCommand;
  }

  public addEventListenersToPermCanvas() {
    for (let eventWithHandler of this.eventsWithHandlers) {
      const { eventListener: eventHandler, eventType: eventName } =
        eventWithHandler;
      this.canvasPerm.addEventListener(eventName, eventHandler);
    }
  }

  public removeEventListenersFromPermCanvas() {
    for (let eventWithHandler of this.eventsWithHandlers) {
      const { eventListener: eventHandler, eventType: eventName } =
        eventWithHandler;
      this.canvasPerm.removeEventListener(eventName, eventHandler);
    }
  }

  protected eventsWithHandlers: EventTypeWithListener[] = [];

  protected canvasPerm: HTMLCanvasElement;
  protected rect: DOMRect;
  protected addDrawingCommand: (command: UnstyledDrawingCommand) => void;

  protected abstract createEventListenersWithHandlers: () => void;
}

export const getCurrentCoords = (ev: MouseEvent, rect: DOMRect) => {
  const currentX = ev.clientX - rect.left;
  const currentY = ev.clientY - rect.top;

  return { currentX, currentY };
};
