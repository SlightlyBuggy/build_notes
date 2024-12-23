import { DrawingCommand } from "@/app/lib/util/types"
import { mouseDownSquareTool } from "../lib/squareToolActions"
import { DrawingTool } from "@/app/lib/util/enums"

export interface DrawingToolEventListenerCoordinatorArgs {
    drawingTool: DrawingTool
    canvasPerm: HTMLCanvasElement,
    contextPerm: CanvasRenderingContext2D, 
    addDrawingCommand: (command: DrawingCommand) => void,
    rect: DOMRect
}

interface EventTypeWithListener {
    eventListener: (ev: MouseEvent) => void,
    eventType: 'mousedown' | 'mouseup' | 'mousemove'
}

enum EventTypes {
    MouseDown = 'mousedown'
} 

abstract class DrawingToolEventListenerCoordinator {

    constructor(args: DrawingToolEventListenerCoordinatorArgs)
    {
        const {canvasPerm, contextPerm, rect, addDrawingCommand} = args
        this.canvasPerm = canvasPerm
        this.contextPerm = contextPerm
        this.rect = rect
        this.addDrawingCommand = addDrawingCommand
    }

    public addEventListenersToPermCanvas() {
        for(let eventWithHandler of this.eventsWithHandlers)
        {
            const {eventListener: eventHandler, eventType: eventName} = eventWithHandler
            this.canvasPerm.addEventListener(eventName, eventHandler)
        }
    }

    public removeEventListenersFromPermCanvas() {
        for(let eventWithHandler of this.eventsWithHandlers)
        {
            const {eventListener: eventHandler, eventType: eventName} = eventWithHandler
            this.canvasPerm.removeEventListener(eventName, eventHandler)
        }

    }

    protected eventsWithHandlers: EventTypeWithListener[] = []

    protected canvasPerm: HTMLCanvasElement
    protected contextPerm: CanvasRenderingContext2D
    protected rect: DOMRect
    protected addDrawingCommand: (command: DrawingCommand) => void

    protected abstract createEventListenersWithHandlers: () => void
}

class SquareToolListenerCoordinator extends DrawingToolEventListenerCoordinator {
    constructor(args: DrawingToolEventListenerCoordinatorArgs)
    {
        super(args)
        this.createEventListenersWithHandlers()
    }

    protected createEventListenersWithHandlers = () => {

        const eventType = EventTypes.MouseDown
        const eventListener = (ev: MouseEvent) => {

            const currentX = ev.clientX - this.rect.left;
            const currentY = ev.clientY - this.rect.top;

            mouseDownSquareTool(currentX, currentY, this.contextPerm, this.addDrawingCommand)
        }

        const eventTypeWithHandler: EventTypeWithListener = {eventType: eventType, eventListener: eventListener}
        this.eventsWithHandlers.push(eventTypeWithHandler)

    }
}

export const drawingToolListenerCoordinatorFactory = (drawingToolListenerCoordinatorArgs: DrawingToolEventListenerCoordinatorArgs) =>
{
    const drawingTool = drawingToolListenerCoordinatorArgs.drawingTool
    switch(drawingTool)
    {
        case(DrawingTool.Square):
            return new SquareToolListenerCoordinator(drawingToolListenerCoordinatorArgs)
        default:
            throw new Error(`drawingToolListenerCoordinatorFactory does not handle DraingTool ${drawingTool}`)
    }
}