import {
  DrawingCommand,
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
  contextPerm: CanvasRenderingContext2D;
  contextTemp: CanvasRenderingContext2D;
  rect: DOMRect;
  startingCoords: StartingCoords | null;
  lastCoords: LastCoords | null;
  canvasWidth: number;
  canvasHeight: number;
  painting: boolean;
  addDrawingCommand: (command: DrawingCommand) => void;
  paintingSetter: (paintingVal: boolean) => void;
  startingCoordsSetter: (coords: StartingCoords | null) => void;
  lastCoordsSetter: (coords: LastCoords | null) => void;
  textInputState: TextInputState;
  textInputStateSetter: (inputState: TextInputState) => void;
  selectOnCanvas: (posX: number, posY: number) => void;
  dragInProgress: boolean;
  handleDragOnCanvas: (posX: number, posY: number) => void;
  unSelectOnCanvas: () => void;
  selectedStrokeItem: StrokeItem;
  selectedColor: string;
  tempDrawCommandSetter: (command: DrawingCommand) => void;
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
    const { canvasPerm, contextPerm, rect, addDrawingCommand } = args;
    this.canvasPerm = canvasPerm;
    this.contextPerm = contextPerm;
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
  protected contextPerm: CanvasRenderingContext2D;
  protected rect: DOMRect;
  protected addDrawingCommand: (command: DrawingCommand) => void;

  protected abstract createEventListenersWithHandlers: () => void;
}

class LineToolListenerCoordinator extends DrawingToolEventListenerCoordinator {
  constructor(args: DrawingToolEventListenerCoordinatorArgs) {
    super(args);

    this.contextTemp = args.contextTemp;
    this.startingCoords = args.startingCoords;
    this.lastCoords = args.lastCoords;
    this.canvasWidth = args.canvasWidth;
    this.canvasHeight = args.canvasHeight;
    this.painting = args.painting;
    this.paintingSetter = args.paintingSetter;
    this.startingCoordsSetter = args.startingCoordsSetter;
    this.lastCoordsSetter = args.lastCoordsSetter;
    this.selectedStrokeItem = args.selectedStrokeItem;
    this.selectedColor = args.selectedColor;
    this.tempDrawCommandSetter = args.tempDrawCommandSetter;

    this.createEventListenersWithHandlers();
  }

  private contextTemp: CanvasRenderingContext2D;
  private startingCoords: StartingCoords | null;
  private lastCoords: LastCoords | null;
  private canvasWidth: number;
  private canvasHeight: number;
  private painting: boolean;
  private paintingSetter: (paintingVal: boolean) => void;
  private startingCoordsSetter: (coords: StartingCoords | null) => void;
  private lastCoordsSetter: (coords: LastCoords | null) => void;
  private selectedStrokeItem: StrokeItem;
  private selectedColor: string;
  private tempDrawCommandSetter: (command: DrawingCommand) => void;

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
      this.paintingSetter,
      this.startingCoordsSetter,
      this.lastCoordsSetter
    );
  };

  private mouseUpListener = (ev: MouseEvent) => {
    mouseUpLineTool(
      this.contextTemp,
      this.startingCoords,
      this.lastCoords,
      this.paintingSetter,
      this.startingCoordsSetter,
      this.lastCoordsSetter,
      this.canvasWidth,
      this.canvasHeight,
      this.addDrawingCommand,
      this.selectedStrokeItem,
      this.selectedColor
    );
  };

  private mouseMoveListener = (ev: MouseEvent) => {
    const { currentX, currentY } = getCurrentCoords(ev, this.rect);
    mouseMoveLineTool(
      currentX,
      currentY,
      this.painting,
      this.startingCoords,
      this.lastCoordsSetter,
      this.selectedStrokeItem,
      this.selectedColor,
      this.tempDrawCommandSetter
    );
  };
}

class RadiusedCircleToolListenerCoordinator extends DrawingToolEventListenerCoordinator {
  constructor(args: DrawingToolEventListenerCoordinatorArgs) {
    super(args);

    this.contextTemp = args.contextTemp;
    this.startingCoords = args.startingCoords;
    this.lastCoords = args.lastCoords;
    this.canvasWidth = args.canvasWidth;
    this.canvasHeight = args.canvasHeight;
    this.painting = args.painting;
    this.paintingSetter = args.paintingSetter;
    this.startingCoordsSetter = args.startingCoordsSetter;
    this.lastCoordsSetter = args.lastCoordsSetter;
    this.selectedStrokeItem = args.selectedStrokeItem;
    this.selectedColor = args.selectedColor;
    this.tempDrawCommandSetter = args.tempDrawCommandSetter;

    this.createEventListenersWithHandlers();
  }

  private contextTemp: CanvasRenderingContext2D;
  private startingCoords: StartingCoords | null;
  private lastCoords: LastCoords | null;
  private canvasWidth: number;
  private canvasHeight: number;
  private painting: boolean;
  private paintingSetter: (paintingVal: boolean) => void;
  private startingCoordsSetter: (coords: StartingCoords | null) => void;
  private lastCoordsSetter: (coords: LastCoords | null) => void;
  private selectedStrokeItem: StrokeItem;
  private selectedColor: string;
  tempDrawCommandSetter: (command: DrawingCommand) => void;

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
      this.paintingSetter,
      this.startingCoordsSetter,
      this.lastCoordsSetter
    );
  };

  private mouseUpListener = (ev: MouseEvent) => {
    mouseUpRadiusedCircleTool(
      this.contextTemp,
      this.startingCoords,
      this.lastCoords,
      this.paintingSetter,
      this.startingCoordsSetter,
      this.lastCoordsSetter,
      this.canvasWidth,
      this.canvasHeight,
      this.addDrawingCommand,
      this.selectedStrokeItem,
      this.selectedColor
    );
  };

  private mouseMoveListener = (ev: MouseEvent) => {
    const { currentX, currentY } = getCurrentCoords(ev, this.rect);
    mouseMoveRadiusedCircleTool(
      currentX,
      currentY,
      this.painting,
      this.startingCoords,
      this.lastCoordsSetter,
      this.selectedStrokeItem,
      this.selectedColor,
      this.tempDrawCommandSetter
    );
  };
}

class RectangleToolListenerCoordinator extends DrawingToolEventListenerCoordinator {
  constructor(args: DrawingToolEventListenerCoordinatorArgs) {
    super(args);

    this.contextTemp = args.contextTemp;
    this.startingCoords = args.startingCoords;
    this.lastCoords = args.lastCoords;
    this.canvasWidth = args.canvasWidth;
    this.canvasHeight = args.canvasHeight;
    this.painting = args.painting;
    this.paintingSetter = args.paintingSetter;
    this.startingCoordsSetter = args.startingCoordsSetter;
    this.lastCoordsSetter = args.lastCoordsSetter;
    this.selectedStrokeItem = args.selectedStrokeItem;
    this.selectedColor = args.selectedColor;
    this.tempDrawCommandSetter = args.tempDrawCommandSetter;

    this.createEventListenersWithHandlers();
  }

  private contextTemp: CanvasRenderingContext2D;
  private startingCoords: StartingCoords | null;
  private lastCoords: LastCoords | null;
  private canvasWidth: number;
  private canvasHeight: number;
  private painting: boolean;
  private paintingSetter: (paintingVal: boolean) => void;
  private startingCoordsSetter: (coords: StartingCoords | null) => void;
  private lastCoordsSetter: (coords: LastCoords | null) => void;
  private selectedStrokeItem: StrokeItem;
  private selectedColor: string;
  private tempDrawCommandSetter: (command: DrawingCommand) => void;

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
      this.paintingSetter,
      this.startingCoordsSetter,
      this.lastCoordsSetter
    );
  };

  private mouseUpListener = (ev: MouseEvent) => {
    mouseUpRectangleTool(
      this.contextTemp,
      this.startingCoords,
      this.lastCoords,
      this.paintingSetter,
      this.startingCoordsSetter,
      this.lastCoordsSetter,
      this.canvasWidth,
      this.canvasHeight,
      this.addDrawingCommand,
      this.selectedStrokeItem,
      this.selectedColor
    );
  };

  private mouseMoveListener = (ev: MouseEvent) => {
    const { currentX, currentY } = getCurrentCoords(ev, this.rect);
    mouseMoveRectangleTool(
      currentX,
      currentY,
      this.painting,
      this.startingCoords,
      this.lastCoordsSetter,
      this.selectedStrokeItem,
      this.selectedColor,
      this.tempDrawCommandSetter
    );
  };
}

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
