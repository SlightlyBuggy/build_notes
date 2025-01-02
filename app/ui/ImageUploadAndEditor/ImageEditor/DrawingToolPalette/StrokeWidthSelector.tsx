'use client'

import clsx from "clsx"
import { useState } from "react"
import SelectedStrokeButton from "./StrokeSelection/SelectedStrokeButton"
import StrokeMenu from "./StrokeSelection/StrokeMenu"

export interface StrokeItem {
    strokeName: string
    strokeWidthPx: number
}

const strokeItems: StrokeItem[] = [
    {strokeName: 'small', strokeWidthPx: 2},
    {strokeName: 'medium', strokeWidthPx: 3},
    {strokeName: 'large', strokeWidthPx: 4},
]

export default function StrokeWidthSelector() {

    const [strokeMenuOpen, setStrokeMenuOpen] = useState<boolean>(false)
    const [selectedStrokeItem, setSelectedStrokeItem] = useState<StrokeItem>({strokeName: 'small', strokeWidthPx: 2})

    const openMenu = () => {
        setStrokeMenuOpen(true)
    }

    const closeMenu = () => {
        setStrokeMenuOpen(false)
    }

    if(!strokeMenuOpen)
    {
        return(
            <SelectedStrokeButton openMenu={openMenu}/>
        )
    } else {
        return (

            <StrokeMenu closeMenu={closeMenu} selectedStrokeItem={selectedStrokeItem} setSelectedStrokeItem={setSelectedStrokeItem} availableStrokes={strokeItems}/>
        )
    }
}