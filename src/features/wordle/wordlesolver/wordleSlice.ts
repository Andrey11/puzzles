import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from 'app/store';
import { IWordleState, WordleScreen, WordleStatus } from '../PuzzleWordle.types';

const getWordleSelectedTab = (): string => {
  const stringData = sessionStorage.getItem('wordleSelectedTab') || WordleScreen.SOLVER;
  try {
    const jsonData = JSON.parse(stringData);
    const def = jsonData as string;
    return def.toString();
  } catch (error) {
    return '0';
  }
};

const setWordleSelectedTab = (tabIndex: string) => {
  sessionStorage.setItem('wordleSelectedTab', tabIndex);
};

const initialState: IWordleState = {
  activeScreen: getWordleSelectedTab() as WordleScreen,
  status: 'idle',
  shouldShowRobot: true,
  shouldShowSelectSolverWordsOverlay: false,
  shouldShowEndSolverGameOverlay: false,
};

export const updateActiveScreen =
  (activeScreen: WordleScreen): AppThunk =>
  (dispatch) => {
    setWordleSelectedTab(activeScreen.valueOf() as WordleScreen);
    dispatch(setActiveScreen(activeScreen as string as WordleScreen));
  };

export const wordleSlice = createSlice({
  name: 'wordle',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setActiveScreen: (state, action: PayloadAction<WordleScreen>) => {
      state.activeScreen = action.payload;
    },
    setStatus: (state, action: PayloadAction<WordleStatus>) => {
      state.status = action.payload;
    },
    setShouldShowRobot: (state, action: PayloadAction<boolean>) => {
      state.shouldShowRobot = action.payload;
    },
    setShouldShowSelectSolverWordsOverlay: (state, action: PayloadAction<boolean>) => {
      state.shouldShowSelectSolverWordsOverlay = action.payload;
      state.shouldShowEndSolverGameOverlay = action.payload ? false : state.shouldShowEndSolverGameOverlay;
    },
    setShouldShowEndSolverGameOverlay: (state, action: PayloadAction<boolean>) => {
      state.shouldShowEndSolverGameOverlay = action.payload;
    },
  },
});

export const {
  setActiveScreen,
  setStatus,
  setShouldShowRobot,
  setShouldShowSelectSolverWordsOverlay,
  setShouldShowEndSolverGameOverlay,
} = wordleSlice.actions;

export const getActiveScreen = (state: RootState): WordleScreen =>
  state.puzzle.wordle.activeScreen as string as WordleScreen;
export const isScreenStatsActive = (state: RootState) => getActiveScreen(state) === WordleScreen.ANALYZER;
export const isScreenSolverActive = (state: RootState) => getActiveScreen(state) === WordleScreen.SOLVER;
export const isScreenDictionaryActive = (state: RootState) => getActiveScreen(state) === WordleScreen.DICTIONARY;
export const getWordleStatus = (state: RootState) => state.puzzle.wordle.status;
export const shouldShowRobot = (state: RootState) => state.puzzle.wordle.shouldShowRobot;
export const shouldShowSelectSolverWordsOverlay = (state: RootState) =>
  isScreenSolverActive(state) && state.puzzle.wordle.shouldShowSelectSolverWordsOverlay;
export const shouldShowEndSolverGameOverlay = (state: RootState) =>
  isScreenSolverActive(state) && state.puzzle.wordle.shouldShowEndSolverGameOverlay;

export default wordleSlice.reducer;
