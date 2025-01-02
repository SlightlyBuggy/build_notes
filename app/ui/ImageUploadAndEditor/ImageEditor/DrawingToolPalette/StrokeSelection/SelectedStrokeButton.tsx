export default function SelectedStrokeButton(
    {
        openMenu
    }:
    {
        openMenu: () => void
    }
) {
    
    return(
        <div className="flex items-center pl-3 pr-3">
            <div className="flex items-center">
                <div 
                    className="flex-col hover:cursor-pointer relative space-y-2  hover:bg-yellow-100"
                    onClick={() => {
                        openMenu()
                    }}
                >
                    <div className="h-[2px] w-5 bg-black"></div>
                    <div className="h-[3px] w-5 bg-black"></div>
                    <div className="h-[4px] w-5 bg-black"></div>
                </div>
            </div>
        </div>
    )

}