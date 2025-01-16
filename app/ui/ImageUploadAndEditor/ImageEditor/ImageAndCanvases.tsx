'use client';
import { StaticImageData } from 'next/image';
import React from 'react';

import PermAndTempCanvases from './PermAndTempCanvases';
import { TextInputState } from './TextInput';

export default function ImageAndCanvases({
  imageData,
  canvasHeight,
  canvasWidth,
  canvasRefPerm,
  canvasRefTemp,
  textInputState,
  textInputValueSetter,
  textInputSizeSetter,
  imageRef,
  selectedColor,
}: {
  imageData: StaticImageData;
  canvasHeight: number;
  canvasWidth: number;
  canvasRefPerm: React.RefObject<HTMLCanvasElement>;
  canvasRefTemp: React.RefObject<HTMLCanvasElement>;
  textInputState: TextInputState;
  textInputValueSetter: (value: string) => void;
  textInputSizeSetter: (width: number, height: number) => void;
  imageRef: React.RefObject<HTMLImageElement>;
  selectedColor: string;
}) {
  // TODO: this component can be consolidated into ImageEditor
  return (
    <div className="relative z-1">
      <img src={imageData.src} ref={imageRef} className="absolute" />
      <PermAndTempCanvases
        canvasHeight={canvasHeight}
        canvasWidth={canvasWidth}
        canvasRefPerm={canvasRefPerm}
        canvasRefTemp={canvasRefTemp}
        textInputState={textInputState}
        textInputValueSetter={textInputValueSetter}
        textInputSizeSetter={textInputSizeSetter}
        selectedColor={selectedColor}
      />
    </div>
  );
}
