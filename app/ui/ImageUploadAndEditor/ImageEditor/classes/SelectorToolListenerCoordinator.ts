import {
  DrawingToolEventListenerCoordinator,
  DrawingToolEventListenerCoordinatorArgs,
  EventTypes,
  getCurrentCoords,
} from './DrawingToolEventListenerCoordinator';

export class SelectorToolListenerCoordinator extends DrawingToolEventListenerCoordinator {
  constructor(args: DrawingToolEventListenerCoordinatorArgs) {
    super(args);
    this.selectOnCanvas = args.selectOnCanvas;
    this.dragInProgress = args.dragInProgress;
    this.handleDragOnCanvas = args.handleDragOnCanvas;
    this.unSelectOncanvas = args.unSelectOnCanvas;
    this.startDragOnCanvas = args.startDragOnCanvas;

    this.createEventListenersWithHandlers();
  }
  private selectOnCanvas: (posX: number, posY: number) => void;
  private dragInProgress: boolean;
  private handleDragOnCanvas: (posX: number, posY: number) => void;
  private unSelectOncanvas: () => void;
  private startDragOnCanvas: (posX: number, posY: number) => void;
  protected createEventListenersWithHandlers = () => {
    this.eventsWithHandlers.push({
      eventType: EventTypes.Click,
      eventListener: this.mouseClickListener,
    });
    this.eventsWithHandlers.push({
      eventType: EventTypes.MouseMove,
      eventListener: this.mouseMoveListener,
    });
    this.eventsWithHandlers.push({
      eventType: EventTypes.MouseUp,
      eventListener: this.mouseUpEventListener,
    });
    this.eventsWithHandlers.push({
      eventType: EventTypes.MouseDown,
      eventListener: this.mouseDownListener,
    });
  };

  private mouseClickListener = (ev: MouseEvent) => {
    ev.preventDefault();

    const { currentX, currentY } = getCurrentCoords(ev, this.rect);
    this.selectOnCanvas(currentX, currentY);
  };

  private mouseDownListener = (ev: MouseEvent) => {
    ev.preventDefault();

    const { currentX, currentY } = getCurrentCoords(ev, this.rect);
    this.startDragOnCanvas(currentX, currentY);
  };

  private mouseMoveListener = (ev: MouseEvent) => {
    ev.preventDefault();

    const { currentX, currentY } = getCurrentCoords(ev, this.rect);

    this.handleDragOnCanvas(currentX, currentY);
  };

  private mouseUpEventListener = (ev: MouseEvent) => {
    ev.preventDefault();
    this.unSelectOncanvas();
  };
}
