import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { ALPHABET } from "../../features/wordle/PuzzleWords";

import {
  ILetterKey,
  IPuzzlesKeyboardState,
  KeyboardColor,
  KeyboardLetter,
  KeyboardLetterColor,
  KEYBOARD_COLORS,
} from "./PuzzlesKeyboard.types";

export const generateAlphabetLetters = () => {
  let lettersRecord = {};
  lettersRecord = [...ALPHABET].reduce(
    (a, ltr) => ({
      ...a,
      [ltr as KeyboardLetter]: {
        letter: ltr,
        letterColor: "GREY_OUTLINE" as KeyboardLetterColor,
      },
    }),
    {}
  );

  return lettersRecord as Record<KeyboardLetter, ILetterKey>;
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

export const puzzlesKeyboardSlice = createSlice({
  name: "wordleKeyboard",
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
    setLetterColor: (
      state: IPuzzlesKeyboardState,
      action: PayloadAction<LetterColorPayload>
    ) => {
      state.letters[action.payload.letter].letterColor = action.payload.color;
    },
    resetKeyboard: () => {
      return {...initialState};
    },
  },
});

export const { setLetters, setKeyboardColor, setLetterColor, resetKeyboard } =
  puzzlesKeyboardSlice.actions;

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
    letterColor: "GREY" as KeyboardLetterColor,
  };
};

export default puzzlesKeyboardSlice.reducer;
