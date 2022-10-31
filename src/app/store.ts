import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit';
import appReducer from './appSlice';
import wordleReducer from '../features/wordle/wordleSlice';
import dictionaryReducer from '../features/wordle/components/dictionary/dictionarySlice';
import wordleVersusReducer from '../features/wordle/components/wordleversus/wordleVersusSlice';
import wordleKeyboardReducer from '../components/keyboard/puzzlesKeyboardSlice';
import wordleRowGroupReducer from '../features/wordle/components/rowgroup/rowGroupSlice';
import wordleVersusGameReducer from '../features/wordle/components/wordleversus/wordleVersusGameSlice';

const uiReducers = combineReducers({
  keyboard: wordleKeyboardReducer,
  rowGroup: wordleRowGroupReducer,
  dictionary: dictionaryReducer,
})

const wordleReducers = combineReducers({
  wordle: wordleReducer,
  wordleversus: wordleVersusReducer,
  wordleVersusGame: wordleVersusGameReducer,
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
