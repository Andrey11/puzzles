import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../../app/store";

import { IGameState, RoundKey, ROUND_IDS } from "./PuzzleWordleVersus.types";

const initialState: IGameState = {
  wod: "OCEAN",
  currentRound: "ROUND_1",
  rounds: {
    ROUND_1: { roundId: ROUND_IDS.ROUND_1, guessWord: [] },
    ROUND_2: { roundId: ROUND_IDS.ROUND_2, guessWord: [] },
    ROUND_3: { roundId: ROUND_IDS.ROUND_3, guessWord: [] },
    ROUND_4: { roundId: ROUND_IDS.ROUND_4, guessWord: [] },
    ROUND_5: { roundId: ROUND_IDS.ROUND_5, guessWord: [] },
    ROUND_6: { roundId: ROUND_IDS.ROUND_6, guessWord: [] },
  },
  isUserGame: true,
  isWon: false,
  isLost: false,
  score: 0,
};

type AddWordToRoundAction = { roundId: RoundKey; word: Array<string> };
type SetWordValidToRoundAction = { roundId: RoundKey; isValid: boolean };

export const wordleVersusGameSlice = createSlice({
  name: "wordleVersusGame",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setWOD: (state, action: PayloadAction<string>) => {
      state.wod = action.payload;
    },
    setCurrentRound: (state, action: PayloadAction<RoundKey>) => {
      state.currentRound = action.payload;
    },
    setScore: (state, action: PayloadAction<number>) => {
      state.score = action.payload;
    },
    setGuessWordByRoundId: (
      state,
      action: PayloadAction<AddWordToRoundAction>
    ) => {
      state.rounds[action.payload.roundId].guessWord = action.payload.word;
    },
    setGuessWordValidByRoundId: (
      state,
      action: PayloadAction<SetWordValidToRoundAction>
    ) => {
      state.rounds[action.payload.roundId].isValidWord = action.payload.isValid;
    },
    setWonRound: (state, action: PayloadAction<boolean>) => {
      state.isWon = action.payload;
    },
    setLostRound: (state, action: PayloadAction<boolean>) => {
      state.isLost = action.payload;
    },
    setIsUserGame: (state, action: PayloadAction<boolean>) => {
      state.isUserGame = action.payload;
    },
    resetGame: () => ({ ...initialState }),
  },
});

export const {
  setWOD,
  setCurrentRound,
  setScore,
  setGuessWordByRoundId,
  setGuessWordValidByRoundId,
  setLostRound,
  setWonRound,
  setIsUserGame,
  resetGame,
} = wordleVersusGameSlice.actions;

export const isUserGame = (state: RootState) => state.puzzle.wordleVersusGame.isUserGame;
export const isWonGame = (state: RootState): boolean => state.puzzle.wordleVersusGame.isWon === true;
export const isLostGame = (state: RootState): boolean => state.puzzle.wordleVersusGame.isLost === true;

export const getScore = (state: RootState) => state.puzzle.wordleVersusGame.score;
export const getCurrentRound = (state: RootState) => state.puzzle.wordleVersusGame.currentRound;
export const getWOD = (state: RootState) => state.puzzle.wordleVersusGame.wod;
export const getCurrentGame = (state: RootState) => state.puzzle.wordleVersusGame;

export const getRoundById = (state: RootState, roundId: RoundKey) =>
  state.puzzle.wordleVersusGame.rounds[roundId];

export default wordleVersusGameSlice.reducer;
