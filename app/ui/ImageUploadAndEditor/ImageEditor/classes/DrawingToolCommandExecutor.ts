import { DrawingTool } from '@/app/lib/util/enums';
import { ObjectBoundaries, StyledDrawingCommand } from '@/app/lib/util/types';

abstract class DrawingToolCommandExecutor {
  public executeCommand(): void {
    try {
      this._executeCommand();
      this.drawBoxAroundSelectedCommand();
    } catch (error) {
      console.error(
        `Unable to implement drawing command: ${JSON.stringify(this.command)}`
      );
    }
  }

  private selectedCommandBorderOffsetPx = 10;
  private selectedCommandBorderColor = '#38ffff';

  private drawBoxAroundSelectedCommand = () => {
    if (this.command.selected && this.command.objectBoundaries) {
      const selectionBoxBoundaries = this.getSelectedCommandBorderCoords(
        this.command.objectBoundaries
      );

      const width =
        selectionBoxBoundaries.rightX - selectionBoxBoundaries.leftX;
      const height =
        selectionBoxBoundaries.bottomY - selectionBoxBoundaries.topY;

      this.drawingContext.strokeStyle = this.selectedCommandBorderColor;
      this.drawingContext.setLineDash([10, 10]);

      this.drawingContext.strokeRect(
        selectionBoxBoundaries.leftX,
        selectionBoxBoundaries.topY,
        width,
        height
      );
      this.drawingContext.setLineDash([]);
    }
  };

  private getSelectedCommandBorderCoords = (boundaries: ObjectBoundaries) => {
    const selectedCommandBorderBoundaries: ObjectBoundaries = {
      leftX: boundaries.leftX - this.selectedCommandBorderOffsetPx,
      rightX: boundaries.rightX + this.selectedCommandBorderOffsetPx,
      topY: boundaries.topY - this.selectedCommandBorderOffsetPx,
      bottomY: boundaries.bottomY + this.selectedCommandBorderOffsetPx,
    };

    return selectedCommandBorderBoundaries;
  };

  protected abstract _executeCommand(): void;
  protected drawingContext: CanvasRenderingContext2D;
  protected command: StyledDrawingCommand;

  constructor(
    command: StyledDrawingCommand,
    drawingContext: CanvasRenderingContext2D
  ) {
    this.command = command;
    this.drawingContext = drawingContext;
  }
}

class LineToolCommandExecutor extends DrawingToolCommandExecutor {
  protected _executeCommand(): void {
    if (
      this.command.endX &&
      this.command.endY &&
      this.command.strokeWidth &&
      this.command.color
    ) {
      // its possible someone has just clicked but not actually drawn a line.  if so, ignore that
      // TODO: find a better way to accomplish this filtering, preferrably before the command gets into the command queue
      if (
        !(
          this.command.startX == this.command.endX &&
          this.command.startY == this.command.endY
        )
      ) {
        this.drawingContext.strokeStyle = this.command.color;
        this.drawingContext.lineWidth = this.command.strokeWidth;
        this.drawingContext.beginPath();
        this.drawingContext.moveTo(this.command.startX, this.command.startY);
        this.drawingContext.lineTo(this.command.endX, this.command.endY);
        this.drawingContext.stroke();
      }
    } else {
      throw new Error(
        `Missing required values in command for LineToolCommandExecutor.  Provided command values: ${JSON.stringify(this.command)}`
      );
    }
  }
}

class RadiusedCircleCommandExecutor extends DrawingToolCommandExecutor {
  protected _executeCommand(): void {
    if (
      this.command.strokeWidth &&
      this.command.color &&
      this.command.radius != undefined
    ) {
      // if radius is 0, then the user may have clicked without dragging.  ignore
      // TODO: find a better way to accomplish this filtering, preferrably before the command gets into the command queue
      if (this.command.radius) {
        this.drawingContext.strokeStyle = this.command.color;
        this.drawingContext.lineWidth = this.command.strokeWidth;
        this.drawingContext.beginPath();
        this.drawingContext.arc(
          this.command.startX,
          this.command.startY,
          this.command.radius,
          0,
          2 * Math.PI
        );
      }
      this.drawingContext.stroke();
    } else {
      throw new Error(
        `Missing required values in command for RadiusedCircleCommandExecutor.  Provided command values: ${JSON.stringify(this.command)}`
      );
    }
  }
}

class RectangleToolCommandExecutor extends DrawingToolCommandExecutor {
  protected _executeCommand(): void {
    if (
      this.command.endX &&
      this.command.endY &&
      this.command.strokeWidth &&
      this.command.color
    ) {
      // its possible someone has just clicked but not actually drawn a rectangle.  if so, ignore that
      // TODO: find a better way to accomplish this filtering, preferrably before the command gets into the command queue
      if (
        !(
          this.command.startX == this.command.endX &&
          this.command.startY == this.command.endY
        )
      ) {
        this.drawingContext.strokeStyle = this.command.color;
        this.drawingContext.lineWidth = this.command.strokeWidth;
        const width = this.command.endX - this.command.startX;
        const height = this.command.endY - this.command.startY;
        this.drawingContext.strokeRect(
          this.command.startX,
          this.command.startY,
          width,
          height
        );
      }
    } else {
      throw new Error(
        `Missing required values in command for LineToolCommandExecutor.  Provided command values: ${JSON.stringify(this.command)}`
      );
    }
  }
}

class TextCommandExecutor extends DrawingToolCommandExecutor {
  protected _executeCommand(): void {
    if (this.command.text) {
      this.drawingContext.font = '1.25em Arial';
      this.drawingContext.fillStyle = this.command.color;
      this.drawingContext.fillText(
        this.command.text,
        this.command.startX,
        this.command.startY
      );
    }
  }
}

export const drawCommandExecutorFactory = (
  command: StyledDrawingCommand,
  permDrawingContext: CanvasRenderingContext2D
): DrawingToolCommandExecutor => {
  switch (command.drawingTool) {
    case DrawingTool.Line:
      return new LineToolCommandExecutor(command, permDrawingContext);
    case DrawingTool.RadiusedCircle:
      return new RadiusedCircleCommandExecutor(command, permDrawingContext);
    case DrawingTool.Rectangle:
      return new RectangleToolCommandExecutor(command, permDrawingContext);
    case DrawingTool.Text:
      return new TextCommandExecutor(command, permDrawingContext);
    default:
      throw new Error(
        `drawCommandExecutorFactory does not handle DrawingTool ${command.drawingTool}`
      );
  }
};
