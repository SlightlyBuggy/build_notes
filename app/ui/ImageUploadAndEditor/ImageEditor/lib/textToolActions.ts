import { DrawingCommand } from "@/app/lib/util/types";
import { TextInputState } from "../TextInput";

export const mouesDownTextTool = (currentX: number, currentY: number, addDrawingCommand: (command: DrawingCommand) => void, textInputStateSetter: (inputState: TextInputState) => void) => {
    textInputStateSetter({active: true, posX: currentX, posY: currentY})
}
