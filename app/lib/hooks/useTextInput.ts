import { TextInputState } from '@/app/ui/ImageUploadAndEditor/ImageEditor/TextInput';
import { useState } from 'react';

export const useTextInput = () =>
  // {}:{}
  {
    const [textInputState, setTextInputState] = useState<TextInputState>({
      active: false,
      posX: 0,
      posY: 0,
      value: '',
      width: 0,
      height: 0,
    });

    const textInputStateSetter = (newTextInputState: TextInputState) => {
      // if the input is active and we click around, don't do anything, otherwise
      // the input would move to wherever we click.  later we want to 'commit' the text by
      // clicking outside the text field
      if (textInputState.active && newTextInputState.active) {
        return;
      }

      setTextInputState(newTextInputState);
    };

    const textInputValueSetter = (value: string) => {
      setTextInputState({ ...textInputState, value: value });
    };

    const textInputSizeSetter = (width: number, height: number) => {
      setTextInputState({ ...textInputState, width: width, height: height });
    };

    return {
      textInputStateSetter,
      textInputValueSetter,
      textInputSizeSetter,
      textInputState,
    };
  };
