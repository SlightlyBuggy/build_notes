import { DrawingCommand } from "@/app/lib/util/types";
import { ArrowUturnLeftIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
// TODO: support undo hotkey
export default function UndoButton(
    {
        undoLastDrawingCommand, drawingCommands
    }:{
        undoLastDrawingCommand: () => void, drawingCommands: DrawingCommand[]
    }) {
    // TODO: cursor is pointer only when clickable
    return (
        <div data-testid='undo-button' className={clsx(
            "p-3 flex items-center",
            {"select-none text-gray-400": drawingCommands.length == 0 }
        )}
        onClick={undoLastDrawingCommand} 
        >
            <ArrowUturnLeftIcon  className="size-6 hover:bg-yellow-100  hover:cursor-pointer" />
        </div>
    )
}