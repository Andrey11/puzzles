import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../../../app/store';
import { getIndexByLetterCode } from '../../PuzzleWordle-helpers';
import {
  IWordleDictionary,
  Letters,
  WordleStatus,
} from '../../PuzzleWordle.types';
import { allAvailableWords } from '../../PuzzleWords';

export async function initDictionary() {

  console.log(`[wordleDictionarySlice] initDictionary`);

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
  
  allAvailableWords.forEach((word: string) => {
    const startingLetter = word.charAt(0) as Letters;
    wordsDictionary.wordsBy[startingLetter].push(word);
    wordsDictionary.wordsBy[startingLetter].sort();
    const wordIndex: number = wordsDictionary.words.push(word) - 1;
    word.split('').forEach((charVal: string) => {
      const letterCode = getIndexByLetterCode(charVal);
      if (!Array.isArray(wordsDictionary.letters[letterCode])) {
        wordsDictionary.letters[letterCode] = [];
      }
      wordsDictionary.letters[letterCode].push(wordIndex);
    });
  });

  return wordsDictionary;
};

export const createDictionary =
  (listOfWords: Array<string> = allAvailableWords): AppThunk =>
  (dispatch, getState) => {

    if (getDictionaryStatus(getState()) !== 'idle') {
      return;
    }

    dispatch(setStatus('loading'));
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
    
    listOfWords.forEach((word: string) => {
      const startingLetter = word.charAt(0) as Letters;
      wordsDictionary.wordsBy[startingLetter].push(word);
      wordsDictionary.wordsBy[startingLetter].sort();
      const wordIndex: number = wordsDictionary.words.push(word) - 1;
      word.split('').forEach((charVal: string) => {
        const letterCode = getIndexByLetterCode(charVal);
        if (!Array.isArray(wordsDictionary.letters[letterCode])) {
          wordsDictionary.letters[letterCode] = [];
        }
        wordsDictionary.letters[letterCode].push(wordIndex);
      });
    });

    dispatch(setDictionary({dictionary: wordsDictionary, status: 'loaded'}));
  };

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

export interface IWordlewordleDictionaryState {
  dictionary: IWordleDictionary;
  status: WordleStatus;
}

const initialState: IWordlewordleDictionaryState = {
  dictionary: initialDictionary,
  status: 'idle',
};

export const wordleDictionarySlice = createSlice({
  name: 'wordledictionary',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setStatus: (state, action: PayloadAction<WordleStatus>) => {
      state.status = action.payload;
    },
    setDictionary: (state, action: PayloadAction<IWordlewordleDictionaryState>) => {
      state.dictionary = action.payload.dictionary;
      state.status = action.payload.status;
    },
  },
});

export const { setStatus, setDictionary } = wordleDictionarySlice.actions;

export const isDictionaryLoaded = (state: RootState): boolean =>
  state.puzzle.wordledictionary.status === 'loaded';
export const getDictionaryStatus = (state: RootState): WordleStatus =>
  state.puzzle.wordledictionary.status;
export const getDictionary = (state: RootState) =>
  state.puzzle.wordledictionary.dictionary;
export const isValidWord = (state: RootState, word: string | string[]): boolean =>
  getDictionary(state).words.indexOf((typeof word === 'string') ? word : word.join('')) !== -1;

export const getSelectableWords = (state: RootState) => {
  return getDictionary(state).words.map((word: string) => ({
    value: word,
    label: word,
  }));
};

export default wordleDictionarySlice.reducer;
