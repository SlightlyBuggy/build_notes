import { StyledDrawingCommand } from '@/app/lib/util/types';
import { ArrowUturnRightIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

export default function RedoButton({
  redoLastUndoneCommand,
  undoneDrawCommandHistories,
}: {
  redoLastUndoneCommand: () => void;
  undoneDrawCommandHistories: Array<StyledDrawingCommand[]>;
}) {
  return (
    <div
      data-testid="redo-button"
      className={clsx('p-3 flex items-center', {
        'select-none text-gray-400 pointer-events-none':
          undoneDrawCommandHistories.length == 0,
      })}
      onClick={redoLastUndoneCommand}
    >
      <ArrowUturnRightIcon className="size-6 hover:bg-yellow-100  hover:cursor-pointer" />
    </div>
  );
}
