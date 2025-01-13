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
import { distanceBetweenPoints } from '@/app/lib/util/formulae';
import { DrawingTool } from '@/app/lib/util/enums';
import { getObjectBoundaries } from '@/app/lib/util/selectorDrawingTool';

export class RadiusedCircleToolListenerCoordinator extends DrawingToolEventListenerCoordinator {
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
    command: UnstyledDrawingCommand,
    lastX: number,
    lastY: number
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

    this.mouseDownHandlerForToolsWithPreview({
      startX: currentX,
      startY: currentY,
    });
  };

  private mouseUpListener = (ev: MouseEvent) => {
    console.log('Attempting to add circle command');
    if (this.startingCoords && this.lastCoords) {
      const radius = distanceBetweenPoints(
        this.startingCoords.startX,
        this.startingCoords.startY,
        this.lastCoords.lastX,
        this.lastCoords.lastY
      );
      const command: UnstyledDrawingCommand = {
        drawingTool: DrawingTool.RadiusedCircle,
        startX: this.startingCoords.startX,
        startY: this.startingCoords.startY,
        radius: radius,
      };

      const objectBoundaries = getObjectBoundaries({
        toolType: command.drawingTool,
        startX: command.startX,
        startY: command.startY,
        radius: command.radius,
      });
      command.objectBoundaries = objectBoundaries;

      console.log('adding circle command');
      console.log(command);

      this.addDrawingCommand(command);
    }
  };

  private mouseMoveListener = (ev: MouseEvent) => {
    const { currentX, currentY } = getCurrentCoords(ev, this.rect);

    if (this.painting && this.startingCoords) {
      const radius = distanceBetweenPoints(
        this.startingCoords.startX,
        this.startingCoords.startY,
        currentX,
        currentY
      );

      const command: UnstyledDrawingCommand = {
        drawingTool: DrawingTool.RadiusedCircle,
        startX: this.startingCoords.startX,
        startY: this.startingCoords.startY,
        radius: radius,
      };

      this.setTempDrawCommandAndLastCoords(command, currentX, currentY);
    }
  };
}
