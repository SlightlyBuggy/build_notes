import clsx from 'clsx';
import { StrokeItem } from './StrokeWidthSelector';

export default function StrokeMenuItem({
  thisStrokeItem,
  selectedStrokeItem,
  setSelectedStrokeItem,
}: {
  thisStrokeItem: StrokeItem;
  selectedStrokeItem: StrokeItem;
  setSelectedStrokeItem: (strokeItem: StrokeItem) => void;
}) {
  // Tailwind is not properly handling custom height/width.  workaround below where style is applied directly
  //   const widthClass = `h-[${thisStrokeItem.strokeWidthPx}px]`;
  return (
    <div
      className={clsx(
        'flex items-center hover:cursor-pointer',
        {
          'bg-blue-300':
            thisStrokeItem.strokeName != selectedStrokeItem.strokeName,
        },
        {
          'bg-green-500':
            thisStrokeItem.strokeName == selectedStrokeItem.strokeName,
        }
      )}
      onClick={() => {
        setSelectedStrokeItem(thisStrokeItem);
      }}
    >
      <div className="h-6 w-6 flex items-center justify-center hover:bg-yellow-100">
        {/* <div className={clsx('w-5 bg-black', widthClass)}></div> */}
        <div
          style={{ height: `${thisStrokeItem.strokeWidthPx}px` }}
          className={clsx('w-5 bg-black')}
        />
      </div>
    </div>
  );
}
