import { DrawingTool } from '@/app/lib/util/enums';
import { DrawingToolEventListenerCoordinatorArgs } from './DrawingToolEventListenerCoordinator';
import { LineToolListenerCoordinator } from './LineToolListenerCoordinator';
import { RadiusedCircleToolListenerCoordinator } from './RadiusedCircleToolListenerCoordinator';
import { RectangleToolListenerCoordinator } from './RectangleToolListenerCoordinator';
import { SelectorToolListenerCoordinator } from './SelectorToolListenerCoordinator';
import { TextToolListenerCoordinator } from './TextToolListenerCoordinator';

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
