import {
  UnstyledDrawingCommand,
  LastCoords,
  StartingCoords,
} from '@/app/lib/util/types';
import { DrawingTool } from '@/app/lib/util/enums';
import {
  mouseDownLineTool,
  mouseMoveLineTool,
  mouseUpLineTool,
} from '../lib/lineToolActions';
import {
  mouseDownRadiusedCircleTool,
  mouseMoveRadiusedCircleTool,
  mouseUpRadiusedCircleTool,
} from '../lib/radiusedCircleToolActions';
import { mouesDownTextTool } from '../lib/textToolActions';
import { TextInputState } from '../TextInput';
import {
  mouseDownSelectorTool,
  mouseMoveSelectorTool,
  mouseUpSelectorTool,
} from '../lib/selectorToolActions';
import {
  mouseDownRectangleTool,
  mouseMoveRectangleTool,
  mouseUpRectangleTool,
} from '../lib/rectangleToolActions';
import { StrokeItem } from '../DrawingToolPalette/StrokeSelection/StrokeWidthSelector';

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
  setTempDrawCommandAndLastCoords: (command: UnstyledDrawingCommand) => void;
}

interface EventTypeWithListener {
  eventListener: (ev: MouseEvent) => void;
  eventType: EventTypes;
}

enum EventTypes {
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

class LineToolListenerCoordinator extends DrawingToolEventListenerCoordinator {
  constructor(args: DrawingToolEventListenerCoordinatorArgs) {
    super(args);

    this.startingCoords = args.startingCoords;
    this.lastCoords = args.lastCoords;
    this.painting = args.painting;
    this.mouseDownHandlerForToolsWithPreview =
      args.mouseDownHandlerForToolsWithPreview;
    this.setTempDrawCommandAndLastCoords = args.setTempDrawCommandAndLastCoords;

    this.createEventListenersWithHandlers();
  }

  private startingCoords: StartingCoords | null;
  private lastCoords: LastCoords | null;
  private painting: boolean;
  private mouseDownHandlerForToolsWithPreview: (coords: StartingCoords) => void;
  private setTempDrawCommandAndLastCoords: (
    command: UnstyledDrawingCommand
  ) => void;

  protected createEventListenersWithHandlers = () => {
    this.eventsWithHandlers.push({
      eventType: EventTypes.MouseDown,
      eventListener: this.mouseDownListener,
    });
    this.eventsWithHandlers.push({
      eventType: EventTypes.MouseUp,
      eventListener: this.mouseUpListener,
    });
    this.eventsWithHandlers.push({
      eventType: EventTypes.MouseMove,
      eventListener: this.mouseMoveListener,
    });
  };

  private mouseDownListener = (ev: MouseEvent) => {
    const { currentX, currentY } = getCurrentCoords(ev, this.rect);
    mouseDownLineTool(
      currentX,
      currentY,
      this.mouseDownHandlerForToolsWithPreview
    );
  };

  private mouseUpListener = (ev: MouseEvent) => {
    mouseUpLineTool(
      this.startingCoords,
      this.lastCoords,
      this.addDrawingCommand
    );
  };

  private mouseMoveListener = (ev: MouseEvent) => {
    const { currentX, currentY } = getCurrentCoords(ev, this.rect);
    mouseMoveLineTool(
      currentX,
      currentY,
      this.painting,
      this.startingCoords,
      this.setTempDrawCommandAndLastCoords
    );
  };
}

class RadiusedCircleToolListenerCoordinator extends DrawingToolEventListenerCoordinator {
  constructor(args: DrawingToolEventListenerCoordinatorArgs) {
    super(args);

    this.startingCoords = args.startingCoords;
    this.lastCoords = args.lastCoords;
    this.painting = args.painting;
    this.mouseDownHandlerForToolsWithPreview =
      args.mouseDownHandlerForToolsWithPreview;
    this.setTempDrawCommandAndLastCoords = args.setTempDrawCommandAndLastCoords;

    this.createEventListenersWithHandlers();
  }

  private startingCoords: StartingCoords | null;
  private lastCoords: LastCoords | null;
  private painting: boolean;
  private mouseDownHandlerForToolsWithPreview: (coords: StartingCoords) => void;
  private setTempDrawCommandAndLastCoords: (
    command: UnstyledDrawingCommand
  ) => void;

  protected createEventListenersWithHandlers = () => {
    this.eventsWithHandlers.push({
      eventType: EventTypes.MouseDown,
      eventListener: this.mouseDownListener,
    });
    this.eventsWithHandlers.push({
      eventType: EventTypes.MouseUp,
      eventListener: this.mouseUpListener,
    });
    this.eventsWithHandlers.push({
      eventType: EventTypes.MouseMove,
      eventListener: this.mouseMoveListener,
    });
  };

  private mouseDownListener = (ev: MouseEvent) => {
    ev.preventDefault();
    const { currentX, currentY } = getCurrentCoords(ev, this.rect);
    mouseDownRadiusedCircleTool(
      currentX,
      currentY,
      this.mouseDownHandlerForToolsWithPreview
    );
  };

  private mouseUpListener = (ev: MouseEvent) => {
    mouseUpRadiusedCircleTool(
      this.startingCoords,
      this.lastCoords,
      this.addDrawingCommand
    );
  };

  private mouseMoveListener = (ev: MouseEvent) => {
    const { currentX, currentY } = getCurrentCoords(ev, this.rect);
    mouseMoveRadiusedCircleTool(
      currentX,
      currentY,
      this.painting,
      this.startingCoords,
      this.setTempDrawCommandAndLastCoords
    );
  };
}

class RectangleToolListenerCoordinator extends DrawingToolEventListenerCoordinator {
  constructor(args: DrawingToolEventListenerCoordinatorArgs) {
    super(args);

    this.startingCoords = args.startingCoords;
    this.lastCoords = args.lastCoords;
    this.painting = args.painting;
    this.mouseDownHandlerForToolsWithPreview =
      args.mouseDownHandlerForToolsWithPreview;
    this.setTempDrawCommandAndLastCoords = args.setTempDrawCommandAndLastCoords;

    this.createEventListenersWithHandlers();
  }

  private startingCoords: StartingCoords | null;
  private lastCoords: LastCoords | null;
  private painting: boolean;
  private mouseDownHandlerForToolsWithPreview: (coords: StartingCoords) => void;
  private setTempDrawCommandAndLastCoords: (
    command: UnstyledDrawingCommand
  ) => void;

  protected createEventListenersWithHandlers = () => {
    this.eventsWithHandlers.push({
      eventType: EventTypes.MouseDown,
      eventListener: this.mouseDownListener,
    });
    this.eventsWithHandlers.push({
      eventType: EventTypes.MouseUp,
      eventListener: this.mouseUpListener,
    });
    this.eventsWithHandlers.push({
      eventType: EventTypes.MouseMove,
      eventListener: this.mouseMoveListener,
    });
  };

  private mouseDownListener = (ev: MouseEvent) => {
    const { currentX, currentY } = getCurrentCoords(ev, this.rect);
    mouseDownRectangleTool(
      currentX,
      currentY,
      this.mouseDownHandlerForToolsWithPreview
    );
  };

  private mouseUpListener = (ev: MouseEvent) => {
    mouseUpRectangleTool(
      this.startingCoords,
      this.lastCoords,
      this.addDrawingCommand
    );
  };

  private mouseMoveListener = (ev: MouseEvent) => {
    const { currentX, currentY } = getCurrentCoords(ev, this.rect);
    mouseMoveRectangleTool(
      currentX,
      currentY,
      this.painting,
      this.startingCoords,
      this.setTempDrawCommandAndLastCoords
    );
  };
}
// would be better to have currentX, currentY passed into the coordinator
const getCurrentCoords = (ev: MouseEvent, rect: DOMRect) => {
  const currentX = ev.clientX - rect.left;
  const currentY = ev.clientY - rect.top;

  return { currentX, currentY };
};

class TextToolListenerCoordinator extends DrawingToolEventListenerCoordinator {
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
    mouesDownTextTool(
      currentX,
      currentY,
      this.textInputState,
      this.textInputStateSetter,
      this.addDrawingCommand
    );
  };
}

class SelectorToolListenerCoordinator extends DrawingToolEventListenerCoordinator {
  constructor(args: DrawingToolEventListenerCoordinatorArgs) {
    super(args);
    this.selectOnCanvas = args.selectOnCanvas;
    this.dragInProgress = args.dragInProgress;
    this.handleDragOnCanvas = args.handleDragOnCanvas;
    this.unSelectOncanvas = args.unSelectOnCanvas;

    this.createEventListenersWithHandlers();
  }
  private selectOnCanvas: (posX: number, posY: number) => void;
  private dragInProgress: boolean;
  private handleDragOnCanvas: (posX: number, posY: number) => void;
  private unSelectOncanvas: () => void;
  protected createEventListenersWithHandlers = () => {
    this.eventsWithHandlers.push({
      eventType: EventTypes.MouseDown,
      eventListener: this.mouseDownListener,
    });
    this.eventsWithHandlers.push({
      eventType: EventTypes.MouseMove,
      eventListener: this.mouseMoveListener,
    });
    this.eventsWithHandlers.push({
      eventType: EventTypes.MouseUp,
      eventListener: this.mouseUpEventListener,
    });
  };

  private mouseDownListener = (ev: MouseEvent) => {
    ev.preventDefault();

    const { currentX, currentY } = getCurrentCoords(ev, this.rect);
    mouseDownSelectorTool(currentX, currentY, this.selectOnCanvas);
  };

  private mouseMoveListener = (ev: MouseEvent) => {
    ev.preventDefault();

    const { currentX, currentY } = getCurrentCoords(ev, this.rect);

    mouseMoveSelectorTool(
      currentX,
      currentY,
      this.dragInProgress,
      this.handleDragOnCanvas
    );
  };

  private mouseUpEventListener = (ev: MouseEvent) => {
    ev.preventDefault();

    mouseUpSelectorTool(this.unSelectOncanvas);
  };
}

export const drawingToolListenerCoordinatorFactory = (
  args: DrawingToolEventListenerCoordinatorArgs
) => {
  const drawingTool = args.drawingTool;
  switch (drawingTool) {
    case DrawingTool.Line:
      return new LineToolListenerCoordinator(args);
    case DrawingTool.RadiusedCircle:
      return new RadiusedCircleToolListenerCoordinator(args);
    case DrawingTool.Rectangle:
      return new RectangleToolListenerCoordinator(args);
    case DrawingTool.Text:
      return new TextToolListenerCoordinator(args);
    case DrawingTool.Selector:
      return new SelectorToolListenerCoordinator(args);
    default:
      throw new Error(
        `drawingToolListenerCoordinatorFactory does not handle DraingTool ${drawingTool}`
      );
  }
};
