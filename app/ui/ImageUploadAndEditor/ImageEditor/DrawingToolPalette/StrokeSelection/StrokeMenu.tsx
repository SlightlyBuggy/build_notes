import { StrokeItem } from './StrokeWidthSelector';
import StrokeMenuItem from './StrokeMenuItem';
import { useClickOutsideDiv } from '@/app/lib/hooks/useClickOutside';

export default function StrokeMenu({
  closeMenu,
  selectedStrokeItem,
  setSelectedStrokeItem,
  availableStrokes,
}: {
  closeMenu: () => void;
  selectedStrokeItem: StrokeItem;
  setSelectedStrokeItem: (strokeItem: StrokeItem) => void;
  availableStrokes: StrokeItem[];
}) {
  const containerRef = useClickOutsideDiv(closeMenu);
  return (
    <div ref={containerRef} className="relative z-10 flex items-start">
      <div className="p-3">
        {availableStrokes.map((val, idx) => {
          return (
            <StrokeMenuItem
              key={idx}
              thisStrokeItem={val}
              selectedStrokeItem={selectedStrokeItem}
              setSelectedStrokeItem={setSelectedStrokeItem}
            />
          );
        })}
      </div>
    </div>
  );
}
