import { DrawingCommand, LastCoords, StartingCoords } from "@/app/lib/util/types"
import { mouseDownSquareTool } from "../lib/squareToolActions"
import { DrawingTool } from "@/app/lib/util/enums"
import { mouseDownCircleTool } from "../lib/circleToolActions"
import { mouseDownLineTool, mouseMoveLineTool, mouseUpLineTool } from "../lib/lineToolActions"
import { mouseDownRadiusedCircleTool, mouseMoveRadiusedCircleTool, mouseUpRadiusedCircleTool } from "../lib/radiusedCircleToolActions"

export interface DrawingToolEventListenerCoordinatorArgs {
    drawingTool: DrawingTool
    canvasPerm: HTMLCanvasElement,
    contextPerm: CanvasRenderingContext2D, 
    contextTemp: CanvasRenderingContext2D,
    rect: DOMRect,
    startingCoords: StartingCoords | null,
    lastCoords: LastCoords | null,
    canvasWidth: number,
    canvasHeight: number, 
    painting: boolean
    addDrawingCommand: (command: DrawingCommand) => void,
    paintingSetter: (paintingVal: boolean) => void, 
    startingCoordsSetter: (coords: StartingCoords | null) => void
    lastCoordsSetter: (coords: LastCoords | null) => void
}

interface EventTypeWithListener {
    eventListener: (ev: MouseEvent) => void,
    eventType: EventTypes
}

enum EventTypes {
    MouseDown = 'mousedown',
    MouseUp = 'mouseup',
    MouseMove = 'mousemove'
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
        const eventTypeWithHandler: EventTypeWithListener = {eventType: eventType, eventListener: this.mouseDownListener}
        this.eventsWithHandlers.push(eventTypeWithHandler)
    }

    private mouseDownListener = (ev: MouseEvent) => {
        const {currentX, currentY} = getCurrentCoords(ev, this.rect)
        mouseDownSquareTool(currentX, currentY, this.contextPerm, this.addDrawingCommand)
    }
}

class CircleToolListenerCoordinator extends DrawingToolEventListenerCoordinator {
    constructor(args: DrawingToolEventListenerCoordinatorArgs)
    {
        super(args)
        this.createEventListenersWithHandlers()
    }

    protected createEventListenersWithHandlers = () => {
        this.eventsWithHandlers.push({eventType: EventTypes.MouseDown, eventListener: this.mouseDownListener})
    }

    private mouseDownListener = (ev: MouseEvent) => {
        const {currentX, currentY} = getCurrentCoords(ev, this.rect)
        mouseDownCircleTool(currentX, currentY, this.contextPerm, this.addDrawingCommand)
    }
}

class LineToolListenerCoordinator extends DrawingToolEventListenerCoordinator {
    constructor(args: DrawingToolEventListenerCoordinatorArgs)
    {
        super(args)

        this.contextTemp = args.contextTemp
        this.startingCoords = args.startingCoords
        this.lastCoords = args.lastCoords
        this.canvasWidth = args.canvasWidth
        this.canvasHeight = args.canvasHeight
        this.painting = args.painting
        this.paintingSetter = args.paintingSetter
        this.startingCoordsSetter = args.startingCoordsSetter
        this.lastCoordsSetter = args.lastCoordsSetter

        this.createEventListenersWithHandlers()
    }

    private contextTemp: CanvasRenderingContext2D
    private startingCoords: StartingCoords | null
    private lastCoords: LastCoords | null
    private canvasWidth: number
    private canvasHeight: number
    private painting: boolean
    private paintingSetter: (paintingVal: boolean) => void
    private startingCoordsSetter: (coords: StartingCoords | null) => void
    private lastCoordsSetter: (coords: LastCoords | null) => void

    protected createEventListenersWithHandlers = () => {
        this.eventsWithHandlers.push({eventType: EventTypes.MouseDown, eventListener: this.mouseDownListener})
        this.eventsWithHandlers.push({eventType: EventTypes.MouseUp, eventListener: this.mouseUpListener})
        this.eventsWithHandlers.push({eventType: EventTypes.MouseMove, eventListener: this.mouseMoveListener})
    }

    private mouseDownListener = (ev: MouseEvent) => {
        const {currentX, currentY} = getCurrentCoords(ev, this.rect)
        mouseDownLineTool(currentX, currentY, this.paintingSetter, this.startingCoordsSetter)
    }

    private mouseUpListener = (ev: MouseEvent) => {
        mouseUpLineTool(this.contextTemp, this.startingCoords, this.lastCoords, this.paintingSetter, 
            this.startingCoordsSetter, this.lastCoordsSetter, this.canvasWidth, this.canvasHeight, this.addDrawingCommand)
    }

    private mouseMoveListener = (ev: MouseEvent) => {
        const {currentX, currentY} = getCurrentCoords(ev, this.rect)
        mouseMoveLineTool(currentX, currentY, this.contextTemp, this.painting, this.startingCoords, this.lastCoordsSetter, this.canvasWidth, this.canvasHeight)
    }
}

class RadiusedCircleToolListenerCoordinator extends DrawingToolEventListenerCoordinator {
    constructor(args: DrawingToolEventListenerCoordinatorArgs)
    {
        super(args)

        this.contextTemp = args.contextTemp
        this.startingCoords = args.startingCoords
        this.lastCoords = args.lastCoords
        this.canvasWidth = args.canvasWidth
        this.canvasHeight = args.canvasHeight
        this.painting = args.painting
        this.paintingSetter = args.paintingSetter
        this.startingCoordsSetter = args.startingCoordsSetter
        this.lastCoordsSetter = args.lastCoordsSetter

        this.createEventListenersWithHandlers()
    }

    private contextTemp: CanvasRenderingContext2D
    private startingCoords: StartingCoords | null
    private lastCoords: LastCoords | null
    private canvasWidth: number
    private canvasHeight: number
    private painting: boolean
    private paintingSetter: (paintingVal: boolean) => void
    private startingCoordsSetter: (coords: StartingCoords | null) => void
    private lastCoordsSetter: (coords: LastCoords | null) => void

    protected createEventListenersWithHandlers = () => {
        this.eventsWithHandlers.push({eventType: EventTypes.MouseDown, eventListener: this.mouseDownListener})
        this.eventsWithHandlers.push({eventType: EventTypes.MouseUp, eventListener: this.mouseUpListener})
        this.eventsWithHandlers.push({eventType: EventTypes.MouseMove, eventListener: this.mouseMoveListener})
    }

    private mouseDownListener = (ev: MouseEvent) => {
        const {currentX, currentY} = getCurrentCoords(ev, this.rect)
        mouseDownRadiusedCircleTool(currentX, currentY, this.paintingSetter, this.startingCoordsSetter)
    }

    private mouseUpListener = (ev: MouseEvent) => {
        mouseUpRadiusedCircleTool(this.contextTemp, this.startingCoords, this.lastCoords, this.paintingSetter, this.startingCoordsSetter, this.lastCoordsSetter, this.canvasWidth, this.canvasHeight, this.addDrawingCommand)
    }

    private mouseMoveListener = (ev: MouseEvent) => {
        const {currentX, currentY} = getCurrentCoords(ev, this.rect)
        mouseMoveRadiusedCircleTool(currentX, currentY, this.contextTemp, this.painting, this.startingCoords, this.lastCoordsSetter, this.canvasWidth, this.canvasHeight)
    }
}

const getCurrentCoords = (ev: MouseEvent, rect: DOMRect) => {
    const currentX = ev.clientX - rect.left;
    const currentY = ev.clientY - rect.top;

    return {currentX, currentY}
}

export const drawingToolListenerCoordinatorFactory = (args: DrawingToolEventListenerCoordinatorArgs) =>
{
    const drawingTool = args.drawingTool
    switch(drawingTool)
    {
        case(DrawingTool.Square):
            return new SquareToolListenerCoordinator(args)
        case(DrawingTool.Circle):
            return new CircleToolListenerCoordinator(args)
        case(DrawingTool.Line):
            return new LineToolListenerCoordinator(args)
        case(DrawingTool.RadiusedCircle):
            return new RadiusedCircleToolListenerCoordinator(args)
        default:
            throw new Error(`drawingToolListenerCoordinatorFactory does not handle DraingTool ${drawingTool}`)
    }
}