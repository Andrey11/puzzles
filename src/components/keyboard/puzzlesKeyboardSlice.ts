import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../../app/store';
import { ALPHABET } from 'features/wordle/PuzzleWords';

import {
  ILetterKey,
  IPuzzlesKeyboardState,
  KeyboardColor,
  KeyboardLetter,
  KeyboardLetterColor,
  KEYBOARD_COLORS,
} from './PuzzlesKeyboard.types';

export const generateAlphabetLetters = () => {
  let lettersRecord = {};
  lettersRecord = [...ALPHABET].reduce(
    (a, ltr) => ({
      ...a,
      [ltr as KeyboardLetter]: {
        letter: ltr,
        letterColor: 'GREY_OUTLINE' as KeyboardLetterColor,
      },
    }),
    {}
  );

  return lettersRecord as Record<KeyboardLetter, ILetterKey>;
};

export const setKeyboardColors =
  (word: Array<string>, colors: Array<string>): AppThunk =>
  (dispatch, getState) => {
    let lettersRecordCopy = Object.assign({}, getKeyboardLetters(getState()));
    const keyboardLetterColors: Array<KeyboardLetterColor> = colors.map(
      (char) => char.toUpperCase() as KeyboardLetterColor
    );
    word.forEach((char: string, index: number) => {
      let color: KeyboardLetterColor = keyboardLetterColors[index];
      const letter: KeyboardLetter = char as KeyboardLetter;
      const prevOccurence = word.indexOf(char);
      if (prevOccurence > -1 && prevOccurence !== index) {
        const prevColor = keyboardLetterColors[prevOccurence];
        if (prevColor === 'GREEN' || color === 'GREY') {
          color = prevColor;
        }
      }
      lettersRecordCopy[letter] = {
        ...lettersRecordCopy[letter],
        letterColor: color,
      };
    });
    dispatch(setLetters(lettersRecordCopy));
  };

const initialState: IPuzzlesKeyboardState = {
  keyboardColor: KEYBOARD_COLORS.GREY,
  letters: generateAlphabetLetters(),
  showClearKey: true,
  showDeleteKey: true,
  showEnterKey: true,
};

type LetterColorPayload = {
  letter: KeyboardLetter;
  color: KeyboardLetterColor;
};
type LetterColorPayloadAction = PayloadAction<LetterColorPayload>;

export const puzzlesKeyboardSlice = createSlice({
  name: 'ui_keyboard',
  initialState,
  reducers: {
    setLetters: (
      state: IPuzzlesKeyboardState,
      action: PayloadAction<Record<KeyboardLetter, ILetterKey>>
    ) => {
      state.letters = action.payload;
    },
    setKeyboardColor: (
      state: IPuzzlesKeyboardState,
      action: PayloadAction<KeyboardColor>
    ) => {
      state.keyboardColor = action.payload;
    },
    setKeyboardLetterColor: (
      state: IPuzzlesKeyboardState,
      action: LetterColorPayloadAction
    ) => {
      state.letters[action.payload.letter].letterColor = action.payload.color;
    },
    resetKeyboard: (state: IPuzzlesKeyboardState) => {
      const keys = Object.keys(state.letters);
      keys.forEach((key) => {
        const keyboardLetter = state.letters[key as KeyboardLetter];
        state.letters[key as KeyboardLetter] = {
          ...keyboardLetter,
          letterColor: 'GREY_OUTLINE' as KeyboardLetterColor,
          disabled: false,
          checked: false,
        };
      });
      state.keyboardColor = KEYBOARD_COLORS.GREY;
      // return { ...initialState };
    },
  },
});

export const {
  setLetters,
  setKeyboardColor,
  setKeyboardLetterColor,
  resetKeyboard,
} = puzzlesKeyboardSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const getKeyboardLetters = (state: RootState) =>
  state.puzzle.ui.keyboard.letters;
export const getKeyboardColor = (state: RootState) =>
  state.puzzle.ui.keyboard.keyboardColor;
export const showDeleteKey = (state: RootState) =>
  state.puzzle.ui.keyboard.showDeleteKey;
export const getKeyboardLetter = (
  state: RootState,
  letterString: string
): ILetterKey => {
  const kbLetters = getKeyboardLetters(state);
  const letter = letterString as KeyboardLetter;
  if (kbLetters) {
    return kbLetters[letter];
  }

  return {
    letter,
    letterColor: 'GREY' as KeyboardLetterColor,
  };
};

export default puzzlesKeyboardSlice.reducer;
