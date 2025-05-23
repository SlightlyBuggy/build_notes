'use client';

import { TextInput, TextInputState } from './TextInput';

export default function CanvasesAndTextInput({
  canvasHeight,
  canvasWidth,
  canvasRefPerm,
  canvasRefTemp,
  textInputState,
  textInputValueSetter,
  textInputSizeSetter,
  selectedColor,
}: {
  canvasHeight: number;
  canvasWidth: number;
  canvasRefPerm: React.RefObject<HTMLCanvasElement>;
  canvasRefTemp: React.RefObject<HTMLCanvasElement>;
  textInputState: TextInputState;
  textInputValueSetter: (value: string) => void;
  textInputSizeSetter: (width: number, height: number) => void;
  selectedColor: string;
}) {
  return (
    <div className="z-1 relative">
      <canvas
        data-testid="canvas-perm"
        ref={canvasRefPerm}
        className="absolute z-2"
        height={canvasHeight}
        width={canvasWidth}
      />
      <canvas
        data-testid="canvas-temp"
        ref={canvasRefTemp}
        height={canvasHeight}
        width={canvasWidth}
      />
      <TextInput
        inputState={textInputState}
        valueSetter={textInputValueSetter}
        textInputSizeSetter={textInputSizeSetter}
        selectedColor={selectedColor}
      />
    </div>
  );
}
