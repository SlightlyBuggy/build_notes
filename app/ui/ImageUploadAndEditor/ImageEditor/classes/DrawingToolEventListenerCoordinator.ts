import { DrawingCommand } from "@/app/lib/util/types"
import { mouseDownSquareTool } from "../lib/squareToolActions"

// TODO use this where its needed below, decomposing as needed
interface DrawingToolEventListenerCoordinatorArgs {
    command: DrawingCommand,
    canvasPerm: HTMLCanvasElement,
    contextPerm: CanvasRenderingContext2D, 
    currentX: number,
    currentY: number,
    addDrawingCommand: (command: DrawingCommand) => void
}

interface EventTypeWithListener {
    eventListener: () => void,
    eventType: string
}

enum EventTypes {
    MouseDown = 'mousedown'
} 

abstract class DrawingToolEventListenerCoordinator {

    constructor(command: DrawingCommand, canvasPerm: HTMLCanvasElement, contextPerm: CanvasRenderingContext2D, currentX: number, currentY: number, addDrawingCommand: (command: DrawingCommand) => void)
    {
        this.canvasPerm = canvasPerm
        this.contextPerm = contextPerm
        this.command = command
        this.currentX = currentX
        this.currentY = currentY
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

    protected command: DrawingCommand
    protected canvasPerm: HTMLCanvasElement
    protected contextPerm: CanvasRenderingContext2D
    protected currentX: number
    protected currentY: number
    protected addDrawingCommand: (command: DrawingCommand) => void

    protected abstract createEventListenersWithHandlers: () => void
}

class SquareToolListenerCoordinator extends DrawingToolEventListenerCoordinator {
    constructor(command: DrawingCommand, canvasPerm: HTMLCanvasElement, contextPerm: CanvasRenderingContext2D, currentX: number, currentY: number, addDrawingCommand: (command: DrawingCommand) => void)
    {
        super(command, canvasPerm, contextPerm, currentX, currentY, addDrawingCommand)
        this.createEventListenersWithHandlers()
    }

    protected createEventListenersWithHandlers = () => {

        const eventType = EventTypes.MouseDown
        const eventListener = () => mouseDownSquareTool(this.currentX, this.currentY, this.contextPerm, this.addDrawingCommand)

        const eventTypeWithHandler: EventTypeWithListener = {eventType: eventType, eventListener: eventListener}
        this.eventsWithHandlers.push(eventTypeWithHandler)

    }
}