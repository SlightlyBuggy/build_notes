import clsx from 'clsx';
import { StrokeItem } from './StrokeWidthSelector';

export default function SelectedStrokeButton({
  openMenu,
  selectedStrokeItem,
  strokeItems,
}: {
  openMenu: () => void;
  selectedStrokeItem: StrokeItem;
  strokeItems: StrokeItem[];
}) {
  return (
    <div className="flex items-center pl-3 pr-3">
      <div className="flex items-center">
        <div
          className="flex-col hover:cursor-pointer relative space-y-2  hover:bg-yellow-100"
          onClick={() => {
            openMenu();
          }}
        >
          {strokeItems.map((strokeItem, idx) => {
            const heightClass = `h-[${strokeItem.strokeWidthPx}px] w-5`;
            const thisItemIsActive =
              strokeItem.strokeWidthPx == selectedStrokeItem.strokeWidthPx;
            return (
              <div
                className={clsx(
                  heightClass,
                  thisItemIsActive && 'bg-green-500',
                  !thisItemIsActive && 'bg-black'
                )}
                key={idx}
              ></div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
