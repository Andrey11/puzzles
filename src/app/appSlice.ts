import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { IHeaderItem, ItemAction } from '../components/header/PuzzleHeader';
import { AppStatus, IAppState, IPuzzleCardProps, PUZZLES } from './App.types';

const wordleCardProps: IPuzzleCardProps = {
  puzzleName: PUZZLES.WORDLE,
  codeUrl: 'https://github.com/Andrey11/puzzles',
  navigateUrl: 'wordle/solver',
  puzzleDescription:
    'Wordle solver is based on a popular NYT Wordle app. A friendly {R} will try to solve a wordle you select, and calculate all possible solutions for any wordle scenario.',
  puzzleImageUrl: 'images/logos/wordlesolver-logo.png',
};

const wordleVersusCardProps: IPuzzleCardProps = {
  puzzleName: PUZZLES.WORDLE_VERSUS,
  codeUrl: 'https://github.com/Andrey11/puzzles',
  navigateUrl: 'wordle/versus',
  puzzleDescription:
    'Wordle versus is based on a popular NYT Wordle app. Challenge a friendly {R} to a game of wordle, or a series of games. Can you beat the wordle bot at his own game? ',
  puzzleImageUrl: 'images/logos/wordleversus-logo.png',
};

const initialState: IAppState = {
  activePuzzle: PUZZLES.NONE,
  status: 'idle',
  puzzleCardProps: [wordleCardProps, wordleVersusCardProps],
  headerItems: [],
  headerTitle: '',
  showHeaderDictionaryIcon: false,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setActivePuzzle: (state, action: PayloadAction<PUZZLES>) => {
      state.activePuzzle = action.payload;
    },
    setHeaderTitle: (state, action: PayloadAction<string>) => {
      state.headerTitle = action.payload;
    },
    setHeaderItems: (state, action: PayloadAction<Array<IHeaderItem>>) => {
      state.headerItems = action.payload;
    },
    setHeaderItemAction: (state, action: PayloadAction<ItemAction>) => {
      state.headerItemAction = action.payload;
    },
    setStatus: (state, action: PayloadAction<AppStatus>) => {
      state.status = action.payload;
    },
    setShowHeaderDictionaryIcon: (state, action: PayloadAction<boolean>) => {
      state.showHeaderDictionaryIcon = action.payload;
    },
    addPuzzleCard: (state, action: PayloadAction<IPuzzleCardProps>) => {
      state.puzzleCardProps.push(action.payload);
    },
    addPuzzleCards: (state, action: PayloadAction<Array<IPuzzleCardProps>>) => {
      if (!state.puzzleCardProps) {
        state.puzzleCardProps = [];
      }
      state.puzzleCardProps.push(...action.payload);
    },
  },
});

export const {
  setActivePuzzle,
  setStatus,
  setHeaderTitle,
  setHeaderItems,
  setHeaderItemAction,
  setShowHeaderDictionaryIcon,
  addPuzzleCard,
  addPuzzleCards,
} = appSlice.actions;

export const getActivePuzzle = (state: RootState): PUZZLES =>
  state.app.activePuzzle;
export const getAppStatus = (state: RootState): AppStatus => state.app.status;
export const getPuzzleCards = (state: RootState): Array<IPuzzleCardProps> =>
  state.app.puzzleCardProps;
export const getHeaderItems = (state: RootState): Array<IHeaderItem> =>
  state.app.headerItems || [];
export const getHeaderTitle = (state: RootState): string =>
  state.app.headerTitle || 'PUZZLES';
export const isHeaderItemActionByType = (
  state: RootState,
  itemActionType: ItemAction
) => state.app.headerItemAction === itemActionType;
export const isShowHeaderDictionaryIcon = (state: RootState): boolean => 
  state.app.showHeaderDictionaryIcon === true;


export default appSlice.reducer;
