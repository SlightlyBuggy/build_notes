import { useEffect, useState } from "react"


export interface TextInputState {
    active: boolean
    posX: number
    posY: number
}

export function TextInput(
    {inputState}:
    {inputState: TextInputState}
){
    const [value, setValue] = useState('')

    // when component goes from invisible to visible, clear last text 
    useEffect(() => {
        if(inputState.active)
        {
            setValue('')
        }
    },[inputState.active])

    return(
        <div style={{
                position: 'absolute', 
                top: inputState.posY, 
                left: inputState.posX, 
                display: inputState.active ? 'block' : 'none',
        }}>
            <input 
                type="text" 
                value={value}
                style={{backgroundColor: 'lightblue'}} 
                maxLength={20} 
                onChange={(e) => setValue(e.target.value)}
            />
        </div>
    )
}