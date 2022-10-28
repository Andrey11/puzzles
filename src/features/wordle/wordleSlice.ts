import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../../app/store";
import { getIndexByLetterCode } from "./PuzzleWordle-helpers";
import {
  IWordleDictionary,
  IWordleState,
  Letters,
  WordleScreen,
  WordleStatus,
} from "./PuzzleWordle.types";

const initialDictionary: IWordleDictionary = {
  words: [],
  letters: [],
  wordsBy: {
    A: [],
    B: [],
    C: [],
    D: [],
    E: [],
    F: [],
    G: [],
    H: [],
    I: [],
    J: [],
    K: [],
    L: [],
    M: [],
    N: [],
    O: [],
    P: [],
    Q: [],
    R: [],
    S: [],
    T: [],
    U: [],
    V: [],
    W: [],
    X: [],
    Y: [],
    Z: [],
  },
};

const initialState: IWordleState = {
  activeScreen: WordleScreen.SOLVER,
  dictionaryLoaded: false,
  dictionary: initialDictionary,
  status: "idle",
};

export const wordleSlice = createSlice({
  name: "wordle",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setActiveScreen: (state, action: PayloadAction<WordleScreen>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.activeScreen = action.payload;
    },
    setStatus: (state, action: PayloadAction<WordleStatus>) => {
      state.status = action.payload;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    setDictionaryLoaded: (state, action: PayloadAction<boolean>) => {
      state.dictionaryLoaded = action.payload;
    },
    setDictionary: (state, action: PayloadAction<IWordleDictionary>) => {
      state.dictionary = action.payload;
      state.dictionaryLoaded = true;
    },
  },
});

export const {
  setActiveScreen,
  setStatus,
  setDictionary,
  setDictionaryLoaded,
} = wordleSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const isDictionaryLoaded = (state: RootState) =>
  state.puzzle.wordle.dictionaryLoaded;
export const getActiveScreen = (state: RootState) =>
  state.puzzle.wordle.activeScreen;
export const isScreenDictionaryActive = (state: RootState) =>
  state.puzzle.wordle.activeScreen === WordleScreen.DICTIONARY;

export const getStatus = (state: RootState) => state.puzzle.wordle.status;
export const getDictionary = (state: RootState) =>
  state.puzzle.wordle.dictionary;

export const isValidWord = (state: RootState, word: string): boolean =>
  getDictionary(state).words.indexOf(word) !== -1;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
export const createDictionary =
  (listOfWords: Array<string>): AppThunk =>
  (dispatch, getState) => {
    const wordsDictionary: IWordleDictionary = {
      words: [],
      letters: [],
      wordsBy: {
        A: [],
        B: [],
        C: [],
        D: [],
        E: [],
        F: [],
        G: [],
        H: [],
        I: [],
        J: [],
        K: [],
        L: [],
        M: [],
        N: [],
        O: [],
        P: [],
        Q: [],
        R: [],
        S: [],
        T: [],
        U: [],
        V: [],
        W: [],
        X: [],
        Y: [],
        Z: [],
      },
    };
    dispatch(setStatus("loading"));
    listOfWords.forEach((word: string) => {
      const startingLetter = word.charAt(0) as Letters;
      wordsDictionary.wordsBy[startingLetter].push(word);
      wordsDictionary.wordsBy[startingLetter].sort();
      const wordIndex: number = wordsDictionary.words.push(word) - 1;
      word.split("").forEach((charVal: string) => {
        const letterCode = getIndexByLetterCode(charVal);
        if (!Array.isArray(wordsDictionary.letters[letterCode])) {
          wordsDictionary.letters[letterCode] = [];
        }
        wordsDictionary.letters[letterCode].push(wordIndex);
      });
    });

    dispatch(setDictionary(wordsDictionary));
    dispatch(setStatus("idle"));
  };

export default wordleSlice.reducer;
