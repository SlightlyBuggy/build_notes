import { DrawingTool } from "@/app/lib/util/enums";

abstract class ToolButtonStyles {
    private activeTool: DrawingTool | null;
    abstract thisToolType: DrawingTool;

    private outerSharedStyle = "hover:cursor-pointer"
    private outerActiveStyle = "bg-red-500"

    protected abstract outerFixedStyle: string;
    protected abstract outerInactiveStyle: string;
    
    public abstract innerStyle: string;

    get outerStyle()  {

        const outerStyle = this.outerSharedStyle + " " + this.outerFixedStyle

        if(this.thisToolType === this.activeTool)
        {
            return outerStyle + " " + this.outerActiveStyle
        }
        return outerStyle + " " + this.outerInactiveStyle
    }

    constructor(theActiveTool: DrawingTool | null) {
        this.activeTool = theActiveTool
    }
}

class CircleToolButtonStyles extends ToolButtonStyles {
    thisToolType = DrawingTool.Circle

    outerFixedStyle = "h-5 w-5 rounded-full"
    protected outerInactiveStyle = "hover:bg-yellow-100 bg-green-500"
    innerStyle = ""
}

class SquareToolButtonStyles extends ToolButtonStyles {
    thisToolType = DrawingTool.Square

    outerFixedStyle = "h-6 w-6"
    protected outerInactiveStyle = "hover:bg-yellow-100 bg-yellow-300"
    innerStyle = ""
}

class LineToolButtonStyles extends ToolButtonStyles {
    thisToolType = DrawingTool.Line

    outerFixedStyle = "h-6 w-6 flex items-center group"
    protected outerInactiveStyle = "hover:bg-yellow-100"
    innerStyle = "h-0.5 w-6 bg-black rotate-45 group-hover:bg-gray-500"
}

class RadiusedCircleButtonStyles extends ToolButtonStyles {
    thisToolType = DrawingTool.RadiusedCircle

    outerFixedStyle = "h-6 w-6 flex items-center justify-center"
    protected outerInactiveStyle = "hover:bg-yellow-100"
    innerStyle = "h-5 w-5 rounded-full border-solid border-2 border-black"
}

class TextToolButtonStyles extends ToolButtonStyles {
    thisToolType = DrawingTool.Text

    outerFixedStyle = "h-6 w-6 flex items-center justify-center"
    protected outerInactiveStyle = "hover:bg-yellow-100"    
    innerStyle = "text-2xl"
}

class SelectorToolButtonStyles extends ToolButtonStyles {
    thisToolType = DrawingTool.Selector

    outerFixedStyle = "h-6 w-6 flex items-center group"
    protected outerInactiveStyle = "hover:bg-yellow-100"
    innerStyle = ""
}

export const toolButtonStyleFactory = (thisToolType: DrawingTool, activeToolType: DrawingTool | null): ToolButtonStyles =>
{
    switch(thisToolType)
    {
        case(DrawingTool.Circle):
            return new CircleToolButtonStyles(activeToolType);
        case(DrawingTool.Square):
            return new SquareToolButtonStyles(activeToolType);
        case DrawingTool.Line:
            return new LineToolButtonStyles(activeToolType);
        case DrawingTool.RadiusedCircle:
            return new RadiusedCircleButtonStyles(activeToolType);
        case DrawingTool.Text:
            return new TextToolButtonStyles(activeToolType)
        case DrawingTool.Selector:
            return new SelectorToolButtonStyles(activeToolType)
        default:
            throw new Error(`toolButtonStyleFactory does not handle tool type ${thisToolType}`)
    }
}