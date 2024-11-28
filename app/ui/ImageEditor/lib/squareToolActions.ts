export const mouseDownSquareTool = (currentX: number, currentY: number, ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.rect(currentX, currentY, 10, 10);
    ctx.fillStyle = 'yellow';
    ctx.fill();
}