import clsx from 'clsx';

export default function SelectedColorButton({
  openColorSelector,
  selectedColor,
}: {
  openColorSelector: () => void;
  selectedColor: string;
}) {
  const backgroundColorClass = `bg-[${selectedColor}]`;
  return (
    <div className="flex items-center pl-3 pr-3">
      <div className="flex items-center justify-center h-6 w-6 hover:cursor-pointer hover:bg-yellow-300">
        <div
          onClick={() => openColorSelector}
          className="h-4 w-4"
          style={{ backgroundColor: selectedColor }}
        ></div>
      </div>
    </div>
  );
}
