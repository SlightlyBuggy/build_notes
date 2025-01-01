'use client'

import clsx from "clsx"
import { useState } from "react"

export default function StrokeWidthSelector() {

    const [strokeMenuOpen, setStrokeMenuOpen] = useState<boolean>(false)

    const openMenu = () => {
        setStrokeMenuOpen(true)

    }

    return (
        // <div>
            <div className="relative z-100">
                <div 
                    className="p-3 flex items-center hover:cursor-pointer relative z-100"
                    onClick={() => {
                        console.log("you clicked me")
                        setStrokeMenuOpen(true)
                    }}
                >
                    <div className="h-6 w-6 flex items-center justify-center hover:bg-yellow-100">
                        <div className="h-0.5 w-5 bg-black"></div>
                    </div>
                </div>
                <div 
                    className={clsx(
                        "p-3 flex items-center hover:cursor-pointer",
                        {"absolute top-10": strokeMenuOpen}, // if I add z-index:100 manually in browser, this works.  what the fuck.
                        {"invisible" : !strokeMenuOpen}
                    )}
                    
                >
                    <div className="h-6 w-6 flex items-center justify-center hover:bg-yellow-100">
                        <div className="h-1 w-5 bg-black"></div>
                    </div>
                </div>
                {/* <div 
                    className={clsx(
                        "p-3 flex items-center hover:cursor-pointer relative z-100",
                        {"collapse" : !strokeMenuOpen}
                    )}
                    
                >
                    <div className="h-6 w-6 flex items-center justify-center hover:bg-yellow-100">
                        <div className="h-2 w-5 bg-black"></div>
                    </div>
                </div> */}
            </div>
        // </div>

    )
}