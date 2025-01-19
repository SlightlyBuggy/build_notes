import { useState, DragEvent } from 'react';
import clsx from 'clsx';
import { StaticImageData } from 'next/image';

// TODO: should this be dynamic?
const MAX_IMAGE_PX = 1000;

export default function ImageUpload({
  setImageData,
}: {
  setImageData: (imageData: StaticImageData) => void;
}) {
  const [draggingOverElem, setDraggingOverElem] = useState<boolean>(false);

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDraggingOverElem(false);
    const droppedFiles = event.dataTransfer.files;
    const reader = new FileReader();
    const fileArray = Array.from(droppedFiles);

    // TODO: need to only allow one upload at a time
    // TODO: filter out anything that's not an image file
    if (fileArray.length > 0) {
      reader.onload = function (file) {
        if (file.target && file.target.result) {
          const image = new Image();
          image.src = file.target.result as string; // TODO this sseem like a hack

          image.onload = function () {
            console.log(`before w: ${image.width}, h: ${image.height}`);
            if (image.width > MAX_IMAGE_PX || image.height > MAX_IMAGE_PX) {
              let scaleFactor = 1;
              if (image.width > MAX_IMAGE_PX) {
                scaleFactor = MAX_IMAGE_PX / image.width;
              }
              if (image.height > MAX_IMAGE_PX) {
                const heightScaleFactor = MAX_IMAGE_PX / image.height;
                scaleFactor =
                  heightScaleFactor < scaleFactor
                    ? heightScaleFactor
                    : scaleFactor;
              }

              image.width = image.width * scaleFactor;
              image.height = image.height * scaleFactor;
            }
            console.log(`after w: ${image.width}, h: ${image.height}`);
          };

          setImageData(image);
        }
      };
      reader.readAsDataURL(fileArray[0]);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDraggingOverElem(true);
  };

  return (
    <div className="pt-12">
      <div
        className={clsx(
          'w-[400px] h-[400px] flex items-center justify-center rounded-lg text-black border-dashed border-4 border-green-300',
          { 'bg-slate-400': draggingOverElem },
          { 'bg-slate-200': !draggingOverElem }
        )}
        onDragOver={handleDragOver}
        onDragLeave={() => setDraggingOverElem(false)}
        onDragEnter={(event) => {
          event.preventDefault();
        }}
        onDrop={handleDrop}
      >
        <div className="flex items-center">Drag image here to upload</div>
      </div>
    </div>
  );
}
