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

export class LineToolListenerCoordinator extends DrawingToolEventListenerCoordinator {
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
    const { currentX, currentY } = getCurrentCoords(ev, this.rect);
    this.mouseDownHandlerForToolsWithPreview({
      startX: currentX,
      startY: currentY,
    });
  };

  private mouseUpListener = (ev: MouseEvent) => {
    if (this.startingCoords && this.lastCoords) {
      const command: UnstyledDrawingCommand = {
        drawingTool: DrawingTool.Line,
        startX: this.startingCoords.startX,
        startY: this.startingCoords.startY,
        endX: this.lastCoords.lastX,
        endY: this.lastCoords.lastY,
      };

      const objectBoundaries = getObjectBoundaries({
        toolType: command.drawingTool,
        startX: command.startX,
        startY: command.startY,
        endX: command.endX,
        endY: command.endY,
      });
      command.objectBoundaries = objectBoundaries;

      this.addDrawingCommand(command);
    }
  };

  private mouseMoveListener = (ev: MouseEvent) => {
    const { currentX, currentY } = getCurrentCoords(ev, this.rect);
    if (this.painting && this.startingCoords) {
      const command: UnstyledDrawingCommand = {
        drawingTool: DrawingTool.Line,
        startX: this.startingCoords.startX,
        startY: this.startingCoords.startY,
        endX: currentX,
        endY: currentY,
      };
      this.setTempDrawCommandAndLastCoords(command, currentX, currentY);
    }
  };
}
