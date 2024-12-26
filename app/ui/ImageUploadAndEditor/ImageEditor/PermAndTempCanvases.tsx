'use client'

export default function PermAndTempCanvases({
    canvasHeight,
    canvasWidth,
    canvasRefPerm,
    canvasRefTemp
}: {
    canvasHeight: number,
    canvasWidth: number,
    canvasRefPerm: React.RefObject<HTMLCanvasElement>,
    canvasRefTemp: React.RefObject<HTMLCanvasElement>
}) {


    return (
        <div className="z-1 relative">
            <canvas data-testid="canvas-perm" ref={canvasRefPerm} className="absolute z-2"
            height={canvasHeight} width={canvasWidth}
            />
            <canvas data-testid='canvas-temp' ref={canvasRefTemp}
            height={canvasHeight} width={canvasWidth}
            />
        </div>
        )
}