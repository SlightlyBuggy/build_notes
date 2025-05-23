'use client';

import clsx from 'clsx';
import { useState } from 'react';
import SelectedStrokeButton from './SelectedStrokeButton';
import StrokeMenu from './StrokeMenu';

export interface StrokeItem {
  strokeName: string;
  strokeWidthPx: number;
}

const strokeItems: StrokeItem[] = [
  { strokeName: 'small', strokeWidthPx: 2 },
  { strokeName: 'medium', strokeWidthPx: 3 },
  { strokeName: 'large', strokeWidthPx: 4 },
];

export default function StrokeWidthSelector({
  selectedStrokeItem,
  setSelectedStrokeItem,
}: {
  selectedStrokeItem: StrokeItem;
  setSelectedStrokeItem: (strokeItem: StrokeItem) => void;
}) {
  const [strokeMenuOpen, setStrokeMenuOpen] = useState<boolean>(false);

  const openMenu = () => {
    setStrokeMenuOpen(true);
  };

  const closeMenu = () => {
    setStrokeMenuOpen(false);
  };

  if (!strokeMenuOpen) {
    return (
      <SelectedStrokeButton
        openMenu={openMenu}
        selectedStrokeItem={selectedStrokeItem}
        strokeItems={strokeItems}
      />
    );
  } else {
    return (
      <StrokeMenu
        closeMenu={closeMenu}
        selectedStrokeItem={selectedStrokeItem}
        setSelectedStrokeItem={setSelectedStrokeItem}
        availableStrokes={strokeItems}
      />
    );
  }
}
