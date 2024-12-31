import { useEffect, useRef, useState } from "react"


export interface TextInputState {
    active: boolean
    posX: number
    posY: number
    value: string
    height: number
    width: number
}

const MIN_INPUT_WIDTH_PX = 100

export function TextInput(
    {
        inputState,
        valueSetter,
        textInputSizeSetter
    }:
    {
        inputState: TextInputState,
        valueSetter: (value: string) => void,
        textInputSizeSetter: (width: number, height: number) => void
    }
){
    const inputRef = useRef<HTMLInputElement>(null)
    const spanRef = useRef<HTMLSpanElement>(null)

    const [width, setWidth] = useState(MIN_INPUT_WIDTH_PX)

    // focus when input becomes active
    useEffect(() => {
        inputState.active && inputRef.current && inputRef.current.focus()

    }, [inputState.active])

    // resize input to stay in sync with width of hidden span
    useEffect(() => {
        if(spanRef.current)
        {
            const currentWidth = spanRef.current.offsetWidth
            const currentHeight = spanRef.current.offsetHeight
            // TODO: can we maybe get the height of the input, height of the span, subtract, then half of that is the distance between input and span?  const thing = inputRef.current?.offsetHeight.  then to shift from top left coordinates (input) to bottom left corrdinates (fill), we add the height of the input plus half of the height delta betwen span and input... right?  
            setWidth(currentWidth)
            textInputSizeSetter(currentWidth, currentHeight)
        }
    },[inputState.value])

    return(
        <div style={{
                position: 'absolute', 
                top: inputState.posY, 
                left: inputState.posX, 
                display: inputState.active ? 'block' : 'none',
                }}

        >
            <span 
                id='hide'
                ref={spanRef}
                className="border-cyan-300 border-1"
                style={{fontFamily: "Arial", fontSize: "1.25em", position: 'absolute'}} 
            >
                {inputState.value}
            </span>
            <input 
                type="text" 
                value={inputState.value}
                style={{fontFamily: "Arial", fontSize: "1.25em", width: width, position: 'relative', minWidth: MIN_INPUT_WIDTH_PX}} 

                size={10}

                onChange={(e) => valueSetter(e.target.value)}
                ref={inputRef}
            />
        </div>
    )
}