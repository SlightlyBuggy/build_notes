import { ArrowUturnRightIcon } from "@heroicons/react/20/solid";

export default function RedoButton() {
    return (
        <div className="p-3 flex items-center hover:bg-yellow-100  hover:cursor-pointer">
            <ArrowUturnRightIcon className="size-6 hover:bg-yellow-100  hover:cursor-pointer" />
        </div>
    )
}