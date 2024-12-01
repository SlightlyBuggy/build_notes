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
            <canvas ref={canvasRefPerm} className="absolute z-2"
            height={canvasHeight} width={canvasWidth}
            />
            <canvas ref={canvasRefTemp}
            height={canvasHeight} width={canvasWidth}
            />
        </div>
        )
}