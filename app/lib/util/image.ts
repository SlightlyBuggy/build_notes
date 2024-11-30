export const saveImage = (canvasRefPerm: React.RefObject<HTMLCanvasElement>) => {
    const canvas = canvasRefPerm.current;
    const dataUrl = canvas?.toDataURL('image/png');

    if(dataUrl)
    {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'canvas.png';
        link.click();
    }
}

export const clearCanvas = (ctx: CanvasRenderingContext2D | null | undefined, width: number, height: number) =>
{
    if(ctx)
    {
        ctx.clearRect(0, 0, width, height)
    }
}
