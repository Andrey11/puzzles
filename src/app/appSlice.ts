import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import {
  AppStatus,
  IAppState,
  IPuzzleCardProps,
  PuzzleType,
} from "./App.types";

const wordleCardProps: IPuzzleCardProps = {
  puzzleName: PuzzleType.WORDLE,
  codeUrl: "https://github.com/Andrey11/puzzles",
  navigateUrl: "/wordle",
  puzzleDescription:
    "Wordle solver is based on a popular NYT Wordle app. A friendly {R} will try to solve a wordle you select, and calculate all possible solutions for any wordle scenario.",
  puzzleImageUrl: "images/logos/wordle-logo-1.png",
};

const initialState: IAppState = {
  activePuzzle: PuzzleType.NONE,
  status: "idle",
  puzzleCardProps: [wordleCardProps],
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setActivePuzzle: (state, action: PayloadAction<PuzzleType>) => {
      state.activePuzzle = action.payload;
    },
    setStatus: (state, action: PayloadAction<AppStatus>) => {
      state.status = action.payload;
    },
    addPuzzleCard: (
      state,
      action: PayloadAction<IPuzzleCardProps | Array<IPuzzleCardProps>>
    ) => {
      const currentPuzzleCards = [...state.puzzleCardProps];
      const cardProps = !Array.isArray(action.payload)
        ? [action.payload]
        : action.payload;
      state.puzzleCardProps = currentPuzzleCards.concat(cardProps);
    },
  },
});

export const { setActivePuzzle, setStatus } = appSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const getActivePuzzle = (state: RootState) => state.app.activePuzzle;
export const getAppStatus = (state: RootState) => state.app.status;
export const getPuzzleCards = (state: RootState): Array<IPuzzleCardProps> =>
  state.app.puzzleCardProps;

export default appSlice.reducer;
