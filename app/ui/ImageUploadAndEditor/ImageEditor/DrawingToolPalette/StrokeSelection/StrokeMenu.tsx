import { StrokeItem } from "../StrokeWidthSelector"
import StrokeMenuItem from "./StrokeMenuItem"


export default function StrokeMenu(
    {  
        closeMenu,
        selectedStrokeItem,
        setSelectedStrokeItem,
        availableStrokes
    }:{
        closeMenu: () => void,
        selectedStrokeItem: StrokeItem,
        setSelectedStrokeItem: (strokeItem: StrokeItem) => void,
        availableStrokes: StrokeItem[]
    }
) {
    return (
        <div className="relative z-10 flex items-start"
            onMouseLeave={() => closeMenu()}
        
        >
            <div className="p-3">
                {availableStrokes.map((val, idx) => {
                return  (
                    <StrokeMenuItem key={idx} thisStrokeItem={val} selectedStrokeItem={selectedStrokeItem} setSelectedStrokeItem={setSelectedStrokeItem}/>
                )
                })}
            </div>
        </div>
    )

}