// TODO: should this be dynamic?
const MAX_IMAGE_WIDTH_PX = 1000;
const MAX_IMAGE_HEIGHT_PX = 800;

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
    ctx?.drawImage(
      imageRef.current!,
      0,
      0,
      imageRef.current!.width,
      imageRef.current!.height
    );
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

export const getResizedImageWidthAndHeight = (image: HTMLImageElement) => {
  let imageWidth = image.width;
  let imageHeight = image.height;
  if (image.width > MAX_IMAGE_WIDTH_PX || image.height > MAX_IMAGE_WIDTH_PX) {
    let scaleFactor = 1;
    if (image.width > MAX_IMAGE_WIDTH_PX) {
      scaleFactor = MAX_IMAGE_WIDTH_PX / image.width;
    }
    if (image.height > MAX_IMAGE_HEIGHT_PX) {
      const heightScaleFactor = MAX_IMAGE_HEIGHT_PX / image.height;
      scaleFactor =
        heightScaleFactor < scaleFactor ? heightScaleFactor : scaleFactor;
    }

    imageWidth = image.width * scaleFactor;
    imageHeight = image.height * scaleFactor;
  }

  return { imageWidth, imageHeight };
};
