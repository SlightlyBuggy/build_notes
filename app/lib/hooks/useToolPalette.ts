import { useState } from 'react';
import { DrawingTool } from '../util/enums';
import { StrokeItem } from '@/app/ui/ImageUploadAndEditor/ImageEditor/DrawingToolPalette/StrokeSelection/StrokeWidthSelector';

export const useToolPalette = () => {
  const [activeTool, setActiveTool] = useState<DrawingTool>(
    DrawingTool.Selector
  );
  const [selectedStrokeItem, setSelectedStrokeItem] = useState<StrokeItem>({
    strokeName: 'small',
    strokeWidthPx: 2,
  });

  const [selectedColor, setSelectedColor] = useState<string>('#000000');

  const handleToolClick = (tool: DrawingTool) => {
    // only switch tools if we've clicked a different oneß
    if (tool === activeTool) {
      return;
    }

    setActiveTool(tool);
  };

  return {
    handleToolClick,
    activeTool,
    selectedStrokeItem,
    setSelectedStrokeItem,
    selectedColor,
    setSelectedColor,
  };
};
