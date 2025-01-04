'use client';

import { useState } from 'react';
import SelectedColorButton from './SelectedColorButton';

export default function ColorSelector() {
  const [colorSelectorOpen, setColorSelectorOpen] = useState<boolean>(false);

  // TODO: color selection will need to be moved into useToolPalette hook
  const [selectedColor, setSelectedColor] = useState<string>('#000000');

  const openColorSelector = () => {
    setColorSelectorOpen(true);
  };

  const closeColorSelector = () => {
    setColorSelectorOpen(false);
  };

  if (!colorSelectorOpen) {
    return (
      <SelectedColorButton
        openColorSelector={openColorSelector}
        selectedColor={selectedColor}
      />
    );
  } else {
    return <div>Open</div>;
  }
}
