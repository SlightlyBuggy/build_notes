export const saveImage = (
  canvasRefPerm: React.RefObject<HTMLCanvasElement>,
  imageRef: React.RefObject<HTMLImageElement>,
  executeDrawCommands: () => void,
  clearPermCanvas: () => void
) => {
  const canvas = canvasRefPerm.current;
  const ctx = canvas?.getContext('2d');

  if (canvas) {
    // clear the canvas, draw the image on the canvas, then draw all commands on top of that
    clearPermCanvas();
    ctx?.drawImage(imageRef.current!, 0, 0);
    executeDrawCommands();

    const dataUrl = canvas?.toDataURL('image/png');

    if (dataUrl) {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'canvas.png';
      link.click();

      // set back to original state, without the image on the canvas
      clearPermCanvas();
      executeDrawCommands();
    }
  }
};

export const clearCanvas = (
  ctx: CanvasRenderingContext2D | null | undefined,
  width: number,
  height: number
) => {
  if (ctx) {
    ctx.clearRect(0, 0, width, height);
  }
};
