import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../../app/store";
import { IWordleDictionaryState } from "../../PuzzleWordle.types";

const initialState: IWordleDictionaryState = {
  activeLetter: "A",
};

export const dictionarySlice = createSlice({
  name: "dictionary",
  initialState,

  reducers: {
    setActiveLetter: (state, action: PayloadAction<string>) => {
      state.activeLetter = action.payload;
    },
  },
});

export const { setActiveLetter } = dictionarySlice.actions;

export const getActiveLetter = (state: RootState) =>
  state.puzzle.ui.dictionary.activeLetter;

export default dictionarySlice.reducer;
