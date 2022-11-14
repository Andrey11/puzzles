import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../app/store";
import {
  IWordleState,
  WordleScreen,
  WordleStatus,
} from "../PuzzleWordle.types";

const initialState: IWordleState = {
  activeScreen: WordleScreen.SOLVER,
  status: "idle",
};

export const wordleSlice = createSlice({
  name: "wordle",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setActiveScreen: (state, action: PayloadAction<WordleScreen>) => {
      state.activeScreen = action.payload;
    },
    setStatus: (state, action: PayloadAction<WordleStatus>) => {
      state.status = action.payload;
    },
  },
});

export const {
  setActiveScreen,
  setStatus,
} = wordleSlice.actions;

export const getActiveScreen = (state: RootState) =>
  state.puzzle.wordle.activeScreen;
export const isScreenDictionaryActive = (state: RootState) =>
  getActiveScreen(state) === WordleScreen.DICTIONARY;
export const getWordleStatus = (state: RootState) => state.puzzle.wordle.status;


export default wordleSlice.reducer;
