import { DrawingTool } from "@/app/lib/util/enums";
import { DrawingCommand } from "@/app/lib/util/types";

abstract class DrawingToolCommandExecutor {
    public executeCommand() : void {
        try {
            this._executeCommand()
        }
        catch (error){
            console.error(`Unable to implement drawing command: ${JSON.stringify(this.command)}`)
        }
    }   

    protected abstract _executeCommand(): void
    protected  drawingContext: CanvasRenderingContext2D;
    protected command: DrawingCommand;

    constructor(command: DrawingCommand, drawingContext: CanvasRenderingContext2D) {
        this.command = command
        this.drawingContext = drawingContext;
    }

}

class LineToolCommandExecutor extends DrawingToolCommandExecutor {
    protected _executeCommand(): void {
        if(this.command.endX && this.command.endY)
        {
            this.drawingContext.strokeStyle = "#000";
            this.drawingContext.beginPath();
            this.drawingContext.moveTo(this.command.startX, this.command.startY);
            this.drawingContext.lineTo(this.command.endX, this.command.endY);
            this.drawingContext.stroke();
        } else {
            throw new Error(`Missing required values in command for LineToolCommandExecutor.  Provided command values: ${JSON.stringify(this.command)}`)
        }
    }
}

class RadiusedCircleCommandExecutor extends DrawingToolCommandExecutor {
    protected _executeCommand(): void {
        if(this.command.radius)
        {
            this.drawingContext.strokeStyle = "#000";
            this.drawingContext.beginPath();
            this.drawingContext.arc(this.command.startX, this.command.startY, this.command.radius, 0, 2*Math.PI)
            this.drawingContext.stroke();
        } else {
            throw new Error(`Missing required values in command for RadiusedCircleCommandExecutor.  Provided command values: ${JSON.stringify(this.command)}`)
        }
    }
}

class RectangleToolCommandExecutor extends DrawingToolCommandExecutor {
    protected _executeCommand(): void {
        if(this.command.endX && this.command.endY)
        {
            this.drawingContext.strokeStyle = "#000";
            const width = this.command.endX - this.command.startX 
            const height = this.command.endY - this.command.startY
            this.drawingContext.strokeRect(this.command.startX, this.command.startY, width, height);
        } else {
            throw new Error(`Missing required values in command for LineToolCommandExecutor.  Provided command values: ${JSON.stringify(this.command)}`)
        }
    }
}

class TextCommandExecutor extends DrawingToolCommandExecutor {
    protected _executeCommand(): void {
        if(this.command.text)
        {
            this.drawingContext.font = "1.25em Arial"
            this.drawingContext.fillText(this.command.text, 
                this.command.startX, 
                this.command.startY
            )
        }
    }
}

export const drawCommandExecutorFactory = (command: DrawingCommand, permDrawingContext: CanvasRenderingContext2D): DrawingToolCommandExecutor => 
{
    switch(command.drawingTool)
    {
        case(DrawingTool.Line):
            return new LineToolCommandExecutor(command, permDrawingContext)
        case(DrawingTool.RadiusedCircle):
            return new RadiusedCircleCommandExecutor(command, permDrawingContext)
        case(DrawingTool.Rectangle):
            return new RectangleToolCommandExecutor(command, permDrawingContext)
        case(DrawingTool.Text):
            return new TextCommandExecutor(command, permDrawingContext)
        default:
            throw new Error(`drawCommandExecutorFactory does not handle DrawingTool ${command.drawingTool}`)
    }
}