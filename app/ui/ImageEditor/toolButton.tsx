import { DrawingTool } from "@/app/lib/util/enums";
import clsx from "clsx";

// TODO: inverse video when tool is selected
// TODO: can each tool be its own class where event handlers, button style, etc all come together?
// right now button stuff is in this file.  event handlers are in ImageEditor/lib
// this may need to wait until we have more tools and can see what all abstractions we need

export default function ToolButton(
    {tool, activeTool, handleToolClick}: 
    {tool: DrawingTool, 
     activeTool: DrawingTool | null, 
     handleToolClick: (tool: DrawingTool) => void}) {

        const handleClick = (tool: DrawingTool) => {
            handleToolClick(tool);
        }
    // TODO: with this log statement we can see there are lots of extraneous re-renders.  need to reduce.
    // console.log(`Active tool is ${activeTool}`)

    switch(tool) {
        case DrawingTool.Circle:
            return (
            <div className="p-3 flex items-center" onClick={() => handleClick(DrawingTool.Circle)}>
                <div className={
                    clsx(
                        'h-5 w-5 rounded-full',
                        {'bg-green-300': activeTool == DrawingTool.Circle},
                        {'hover:bg-yellow-100 bg-green-500': activeTool != DrawingTool.Circle},
                    )}
                >
                </div>
            </div>
            )
        case DrawingTool.Square:
            return (
            <div className="p-3 flex items-center" onClick={() => handleClick(DrawingTool.Square)}>
                <div className={
                    clsx(
                        'h-6 w-6',
                        {'bg-green-300': activeTool == DrawingTool.Square},
                        {'hover:bg-yellow-100 bg-yellow-500': activeTool != DrawingTool.Square},
                    )}
                >
                </div>
            </div>
            )
        case DrawingTool.Line:
            return (
            <div className="p-3 flex items-center" onClick={() => handleClick(DrawingTool.Line)}>
                <div className={
                    clsx(
                        'h-6 w-6 flex items-center group',
                        {'bg-green-300': activeTool == DrawingTool.Line},
                        {'hover:bg-yellow-100': activeTool != DrawingTool.Line},
                    )}
                >
                    <div className="h-0.5 w-6 bg-black rotate-45 group-hover:bg-gray-500">
                    </div>
                </div>
            </div>
            )
        case DrawingTool.RadiusedCircle:
            return (
                <div className="p3 flex items-center" onClick={() => handleClick(DrawingTool.RadiusedCircle)}>
                    <div className={
                        clsx(
                        'h-5 w-5 rounded-full border-solid border-2 border-black flex items-center',
                        {'bg-green-300': activeTool == DrawingTool.RadiusedCircle},
                        {'hover:bg-yellow-100 hover:border-gray-500': activeTool != DrawingTool.RadiusedCircle}
                     )}
                >
                </div>
            </div>
            )
    }
}