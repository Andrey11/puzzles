import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../../../../app/store";
import { KeyboardColor } from "../../../../components/keyboard/PuzzlesKeyboard.types";
import {
  CellKey,
  CELL_COLORS,
  CELL_IDS,
  IWordleRowCellUI,
  IWordleRowUI,
  IWordleRowGroupUI,
  RowKey,
  ROW_IDS,
} from "./RowGroup.types";

const createRowCellInitState = (
  cellId: CELL_IDS,
  rowId: ROW_IDS
): IWordleRowCellUI => ({
  cellId: cellId,
  rowId: rowId,
  color: CELL_COLORS.GREY_OUTLINE,
  letter: "",
  disabled: false,
});

const createRowInitState = (rowId: ROW_IDS): IWordleRowUI => ({
  rowId: rowId,
  colors: [],
  letters: [],
  cells: {
    CELL_1: createRowCellInitState(CELL_IDS.CELL_1, rowId),
    CELL_2: createRowCellInitState(CELL_IDS.CELL_2, rowId),
    CELL_3: createRowCellInitState(CELL_IDS.CELL_3, rowId),
    CELL_4: createRowCellInitState(CELL_IDS.CELL_4, rowId),
    CELL_5: createRowCellInitState(CELL_IDS.CELL_5, rowId),
  },
});

export const setCell =
  (ltr: string): AppThunk =>
  (dispatch, getState) => {
    const wordleVersusState = getState().puzzle.wordleversus;
    const rowNumber = wordleVersusState.userRound.currentUserGuess;
    const letters = wordleVersusState.userRound.guessWord.letters;
    const cellNumber = letters.length;

    if (!(ltr === "" && letters.length === 0) && cellNumber <= 5) {
      const payloadAction = {
        rowKey: ROW_IDS[rowNumber] as RowKey,
        cellKey: CELL_IDS[cellNumber] as CellKey,
        letter: ltr,
      };
      dispatch(updateLetterByRowAndCellId(payloadAction));
    }
  };

export const setCellColor =
  (rowIndex: number, cellIndex: number, color: string): AppThunk =>
  (dispatch, getState) => {
    const rowKey: RowKey = ROW_IDS[rowIndex] as RowKey;
    const cellKey: CellKey = CELL_IDS[cellIndex] as CellKey;
    dispatch(updateColorByRowAndCellId({ rowKey, cellKey, color }));
  };

const initialState: IWordleRowGroupUI = {
  rows: {
    ROW_1: createRowInitState(ROW_IDS.ROW_1),
    ROW_2: createRowInitState(ROW_IDS.ROW_2),
    ROW_3: createRowInitState(ROW_IDS.ROW_3),
    ROW_4: createRowInitState(ROW_IDS.ROW_4),
    ROW_5: createRowInitState(ROW_IDS.ROW_5),
    ROW_6: createRowInitState(ROW_IDS.ROW_6),
  },
};

type UpdateLetterPayload = { letter: string; rowKey: RowKey; cellKey: CellKey };
type UpdateColorPayload = { color: string; rowKey: RowKey; cellKey: CellKey };

export const rowGroupSlice = createSlice({
  name: "rowgroup",
  initialState,
  reducers: {
    resetRowGroup: () => {
      return { ...initialState };
    },
    updateLetterByRowAndCellId: (
      state,
      action: PayloadAction<UpdateLetterPayload>
    ) => {
      const { rowKey, cellKey, letter } = action.payload;
      state.rows[rowKey].cells[cellKey].letter = letter;
    },
    updateColorByRowAndCellId: (
      state,
      action: PayloadAction<UpdateColorPayload>
    ) => {
      const { rowKey, cellKey, color } = action.payload;
      state.rows[rowKey].cells[cellKey].color =
        CELL_COLORS[color as KeyboardColor];
    },
  },
});

export const {
  resetRowGroup,
  updateLetterByRowAndCellId,
  updateColorByRowAndCellId,
} = rowGroupSlice.actions;

export const getRowById = (state: RootState, rowId: RowKey): IWordleRowUI => {
  return state.puzzle.ui.rowGroup.rows[rowId];
};

export const getCellByRowAndCellIds = (
  state: RootState,
  rowId: RowKey,
  cellId: CellKey
): IWordleRowCellUI => {
  const rowCell = getRowById(state, rowId).cells;
  return rowCell[cellId];
};

export default rowGroupSlice.reducer;
