import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../../../../app/store";
import {
  KeyboardLetter,
  KeyboardLetterColor,
} from "../../../../components/keyboard/PuzzlesKeyboard.types";
import { setLetterColor } from "../../../../components/keyboard/puzzlesKeyboardSlice";

import {
  IScoreModel,
  IWordleVersusState,
  IWordleVersusUserRound,
} from "../wordleversus/PuzzleWordleVersus.types";

const generateColorsForUserGuess = (guess: Array<string>) => {
  return guess.map((letter) => {
    if (letter === "2") {
      return "green";
    } else if (letter === "1") {
      return "orange";
    }
    return "grey";
  });
};

const generateMatchesForUserGuess = (
  wod: Array<string>,
  guess: Array<string>
) => {
  let matches = [...guess];
  // find exact matches
  wod.forEach((letter, index) => {
    if (letter === matches.at(index)) {
      wod[index] = "";
      matches[index] = "2";
    }
  });
  // find exists in word matches
  wod.forEach((letter, index) => {
    const indexOfLetter = matches.indexOf(letter);
    if (indexOfLetter !== -1) {
      wod[index] = "";
      matches[indexOfLetter] = "1";
    }
  });

  return matches;
};

export const onSubmitUserGuess = (): AppThunk => (dispatch, getState) => {
  const wordleVersusState = getState().puzzle.wordleversus;
  const dictionary = getState().puzzle.wordle.dictionary;
  const userGuessNumber = wordleVersusState.userRound.currentUserGuess;
  const botWordle = wordleVersusState.botWordle;
  const { letters } = wordleVersusState.userRound.guessWord;

  if (userGuessNumber <= 6 && letters.length === 5) {
    const isValid = dictionary.words.includes(letters.join(""));
    dispatch(setGuessWordValid(isValid));
    dispatch(setAnimateInvalidWord(!isValid));

    if (isValid) {
      const matches = generateMatchesForUserGuess(botWordle.split(""), letters);
      const colors = generateColorsForUserGuess(matches);

      letters.forEach((l, index) => {
        const color = colors[index].toUpperCase() as KeyboardLetterColor;
        const letter: KeyboardLetter = l as KeyboardLetter;
        dispatch(setLetterColor({ letter, color }));
      });

      dispatch(
        submitUserGuess({
          currentUserGuess: userGuessNumber,
          guessWord: { colors, letters },
        })
      );
    }
  }
};

export const submitUserGuess =
  (userRound: IWordleVersusUserRound): AppThunk =>
  (dispatch, getState) => {
    const prevUserGuess =
      getState().puzzle.wordleversus.userRound.currentUserGuess;

    if (prevUserGuess < 6) {
      dispatch(addUserGuessToPrevious(userRound));
      dispatch(
        addGuessWord({
          currentUserGuess: prevUserGuess + 1,
          guessWord: { colors: [], letters: [] },
        })
      );
    } else {
      dispatch(addGuessWord(userRound));
    }
  };

export const addLetter =
  (ltr: string): AppThunk =>
  (dispatch, getState) => {
    const wordleVersusState = getState().puzzle.wordleversus;
    const { letters, colors } = wordleVersusState.userRound.guessWord;

    if (letters.length < 5) {
      dispatch(
        addGuessWord({
          currentUserGuess: wordleVersusState.userRound.currentUserGuess,
          guessWord: { colors: colors, letters: [...letters, ltr] },
        })
      );
    }
  };

export const deleteLetter = (): AppThunk => (dispatch, getState) => {
  const wordleVersusState = getState().puzzle.wordleversus;
  const { letters, colors } = wordleVersusState.userRound.guessWord;

  if (letters.length > 0) {
    dispatch(
      addGuessWord({
        currentUserGuess: wordleVersusState.userRound.currentUserGuess,
        guessWord: {
          colors: colors,
          letters: [...letters.slice(0, letters.length - 1)],
        },
      })
    );
  }
};

const initialState: IWordleVersusState = {
  maxGames: 1,
  currentGame: 1,
  score: [
    {
      userScore: 0,
      aiScore: 0,
      gameNumber: 0,
    },
  ],
  isUserTurn: true,
  previousUserGuesses: [],
  botWordle: "OCEAN",
  userRound: {
    currentUserGuess: 1,
    guessWord: { colors: [], letters: [] },
  },
};

type ActionToPrev = PayloadAction<IWordleVersusUserRound>;

export const wordleVersusSlice = createSlice({
  name: "wordleversus",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setMaxGames: (state, action: PayloadAction<number>) => {
      state.maxGames = action.payload;
    },
    setUserTurn: (state, action: PayloadAction<boolean>) => {
      state.isUserTurn = action.payload;
    },
    setBotWordle: (state, action: PayloadAction<string>) => {
      state.botWordle = action.payload;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    setCurrentGame: (state, action: PayloadAction<number>) => {
      state.currentGame = action.payload;
    },
    addScore: (state, action: PayloadAction<IScoreModel>) => {
      state.score = [...state.score, action.payload];
    },
    addGuessWord: (state, action: PayloadAction<IWordleVersusUserRound>) => {
      state.userRound = action.payload;
    },
    setGuessWordValid: (state, action: PayloadAction<boolean>) => {
      state.userRound.isValidWord = action.payload;
    },
    addUserGuessToPrevious: (state, action: ActionToPrev) => {
      state.previousUserGuesses = [
        ...state.previousUserGuesses,
        action.payload,
      ];
    },
    setAnimateInvalidWord: (state, action: PayloadAction<boolean>) => {
      state.showInvalidWordAnimation = action.payload;
    },
  },
});

export const {
  setMaxGames,
  setCurrentGame,
  setUserTurn,
  setBotWordle,
  setGuessWordValid,
  addScore,
  addGuessWord,
  addUserGuessToPrevious,
  setAnimateInvalidWord,
} = wordleVersusSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const isUserTurn = (state: RootState) =>
  state.puzzle.wordleversus.isUserTurn;
export const getMaxGames = (state: RootState) =>
  state.puzzle.wordleversus.maxGames;
export const getScore = (state: RootState) => state.puzzle.wordleversus.score;
export const getUserGuessWord = (state: RootState) =>
  state.puzzle.wordleversus.userRound;
export const getBotWordle = (state: RootState) =>
  state.puzzle.wordleversus.botWordle;
export const getPreviousUserGuesses = (
  state: RootState
): Array<IWordleVersusUserRound> =>
  state.puzzle.wordleversus.previousUserGuesses;
export const getCurrentUserGuess = (state: RootState): number =>
  state.puzzle.wordleversus.userRound.currentUserGuess;
export const isValidGuessWord = (state: RootState): boolean =>
  state.puzzle.wordleversus.userRound.isValidWord !== false;
export const showInvalidWordAnimation = (state: RootState): boolean =>
  state.puzzle.wordleversus.showInvalidWordAnimation === true;

export const getUserGuess = (state: RootState, guessNumber: number) => {
  const userRound = getUserGuessWord(state);
  if (userRound.currentUserGuess === guessNumber) {
    return userRound.guessWord;
  }
  if (userRound.currentUserGuess > guessNumber) {
    return getPreviousUserGuesses(state)[guessNumber - 1].guessWord;
  }
  return {
    letters: ["", "", "", "", ""],
    colors: ["tr", "tr", "tr", "tr", "tr"],
    disabled: true,
  };
};

export default wordleVersusSlice.reducer;
