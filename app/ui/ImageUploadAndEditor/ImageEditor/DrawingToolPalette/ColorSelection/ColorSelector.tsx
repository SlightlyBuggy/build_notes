'use client';

import { useRef, useState } from 'react';
import SelectedColorButton from './SelectedColorButton';
import { HexColorPicker } from 'react-colorful';
import { useClickOutsideDiv } from '@/app/lib/hooks/useClickOutside';

export default function ColorSelector({
  selectedColor,
  setSelectedColor,
}: {
  selectedColor: string;
  setSelectedColor: (color: string) => void;
}) {
  const [colorSelectorOpen, setColorSelectorOpen] = useState<boolean>(false);

  const openColorSelector = () => {
    setColorSelectorOpen(true);
  };

  const closeColorSelector = () => {
    setColorSelectorOpen(false);
  };

  const colorPickerRef = useClickOutsideDiv(() => closeColorSelector());

  if (!colorSelectorOpen) {
    return (
      <SelectedColorButton
        openColorSelector={() => openColorSelector()}
        selectedColor={selectedColor}
      />
    );
  } else {
    return (
      <div className="relative z-10" ref={colorPickerRef}>
        <HexColorPicker color={selectedColor} onChange={setSelectedColor} />
      </div>
    );
  }
}
