import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit';
import appReducer from './appSlice';
import wordleReducer from '../features/wordle/wordlesolver/wordleSlice';
import uiDictionaryReducer from '../features/wordle/components/dictionary/uiDictionarySlice';
import wordleVersusReducer from '../features/wordle/wordleversus/wordleVersusSlice';
import wordleKeyboardReducer from '../components/keyboard/puzzlesKeyboardSlice';
import wordleRowGroupReducer from '../features/wordle/components/rowgroup/rowGroupSlice';
import wordleVersusGameReducer from '../features/wordle/wordleversus/game/wordleVersusGameSlice';
import wordleDictionaryReducer from '../features/wordle/components/dictionary/wordleDictionarySlice';
import robotSolutionReducer from '../features/wordle/wordleversus/game/robot/robotSolutionSlice';

const uiReducers = combineReducers({
  keyboard: wordleKeyboardReducer,
  rowGroup: wordleRowGroupReducer,
  dictionary: uiDictionaryReducer,
})

const wordleReducers = combineReducers({
  wordle: wordleReducer,
  wordleversus: wordleVersusReducer,
  wordleversusgame: wordleVersusGameReducer,
  wordledictionary: wordleDictionaryReducer, 
  wvsrobotsolution: robotSolutionReducer,
  ui: uiReducers,
})

export const store = configureStore({
  reducer: {
    app: appReducer,
    puzzle: wordleReducers,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
