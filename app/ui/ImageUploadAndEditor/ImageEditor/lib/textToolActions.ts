import { DrawingCommand } from "@/app/lib/util/types";
import { TextInputState } from "../TextInput";
import { DrawingTool } from "@/app/lib/util/enums";

export const mouesDownTextTool = (currentX: number, currentY: number, 
    textInputState: TextInputState, 
    textInputStateSetter: (inputState: TextInputState) => void,
    addDrawingCommand: (command: DrawingCommand) => void
) => {
    
    if(textInputState.active)
    {
        if(textInputState.value)
        {
            // TODO: get rid of this magic number for startY.  Right now this accounts for the coordinates anchoring an input's top left corner, while they anchor the context fillText command's bottom left
            // this means we need to shift the fill command down by the height of the text input
            const command: DrawingCommand = {
                drawingTool: DrawingTool.Text,
                startX: textInputState.posX,
                startY: textInputState.posY + 23, 
                text: textInputState.value
            }

            addDrawingCommand(command)
        }
        textInputStateSetter({active: false, posX: textInputState.posX, posY: currentY, value: ''})
        return
    }
    textInputStateSetter({active: true, posX: currentX, posY: currentY, value: ''})
}
