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
  // tailwind is not properly handling custom width/height.  workaround below where style is applied directly.
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
            console.log(`h-[${strokeItem.strokeWidthPx}px]`);
            return (
              <div
                className={clsx(
                  // `h-[${strokeItem.strokeWidthPx}px]`,
                  'w-5 bg-black',
                  {
                    'bg-green-500':
                      strokeItem.strokeWidthPx ==
                      selectedStrokeItem.strokeWidthPx,
                  }
                )}
                style={{ height: `${strokeItem.strokeWidthPx}px` }}
                key={idx}
              ></div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
