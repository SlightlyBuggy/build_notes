import clsx from "clsx"

export default function StrokeMenuItem(
    {
        widthPx,

    }:{
        widthPx: number
    }
) {
    const widthClass = `h-[${widthPx}px]`
    return(
        <div 
            className={clsx(
                "flex items-center hover:cursor-pointer bg-blue-300",
            )}


        >
            <div className="h-6 w-6 flex items-center justify-center hover:bg-yellow-100">
                <div className={clsx(
                    "w-5 bg-black",
                    widthClass
                )}
                
                ></div>
            </div>
        </div>
    )
}