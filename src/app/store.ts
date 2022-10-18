import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit';
import appReducer from './appSlice';
import wordleReducer from '../features/wordle/wordleSlice';
import dictionaryReducer from '../features/wordle/components/dictionary/dictionarySlice';

const wordleReducers = combineReducers({
  wordle: wordleReducer,
  dictionaryPanel: dictionaryReducer,
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
