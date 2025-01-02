import { AvailableStroke } from "../StrokeWidthSelector"
import StrokeMenuItem from "./StrokeMenuItem"


export default function StrokeMenu(
    {  
        closeMenu,
        selectedStroke,
        setSelectedStroke,
        availableStrokes
    }:{
        closeMenu: () => void,
        selectedStroke: AvailableStroke,
        setSelectedStroke: (stroke: AvailableStroke) => void,
        availableStrokes: AvailableStroke[]
    }
) {
    // TODO: pick up here
    return (
        <div className="relative z-10 flex items-start">
            <div className="p-3">
                {availableStrokes.map((val, idx) => {
                return  (
                    <StrokeMenuItem key={idx} widthPx={val.strokeWidthPx} />
                )
                })}
            </div>
        </div>
    )

}