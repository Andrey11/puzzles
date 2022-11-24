import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from 'app/store';
import { KeyboardColor } from 'components/keyboard/PuzzlesKeyboard.types';
import {
  CellKey,
  CELL_COLORS,
  CELL_IDS,
  IWordleRowCellUI,
  IWordleRowUI,
  IWordleRowGroupUI,
  RowKey,
  ROW_IDS,
} from './RowGroup.types';

const createRowCellInitState = (
  cellId: CELL_IDS,
  rowId: ROW_IDS
): IWordleRowCellUI => ({
  cellId: cellId,
  rowId: rowId,
  color: CELL_COLORS.GREY_OUTLINE,
  letter: '',
  disabled: false,
});

const createRowInitState = (rowId: ROW_IDS): IWordleRowUI => ({
  rowId: rowId,
  cells: {
    CELL_1: createRowCellInitState(CELL_IDS.CELL_1, rowId),
    CELL_2: createRowCellInitState(CELL_IDS.CELL_2, rowId),
    CELL_3: createRowCellInitState(CELL_IDS.CELL_3, rowId),
    CELL_4: createRowCellInitState(CELL_IDS.CELL_4, rowId),
    CELL_5: createRowCellInitState(CELL_IDS.CELL_5, rowId),
  },
});

export const setCell =
  (payloadAction: {
    rowKey: RowKey;
    cellKey: CellKey;
    letter: string;
  }): AppThunk =>
  (dispatch) => {
    dispatch(updateLetterByRowAndCellId(payloadAction));
  };

export const setCellColor =
  (rowIndex: number, cellIndex: number, color: string): AppThunk =>
  (dispatch) => {
    const rowKey: RowKey = ROW_IDS[rowIndex] as RowKey;
    const cellKey: CellKey = CELL_IDS[cellIndex] as CellKey;
    dispatch(updateColorByRowAndCellId({ rowKey, cellKey, color }));
  };

export const resetRowGroup = (): AppThunk => (dispatch) => {
  // const rowGroupState = getState().puzzle.ui.rowGroup;
  // const resetLetterColor = { color: CELL_COLORS.GREY_OUTLINE, letter: '' };
  // const payload: IWordleRowGroupUI = {
  //   rows: {
  //     ...rowGroupState.rows,
  //     ROW_1: {
  //       ...rowGroupState.rows.ROW_1,
  //       cells: {
  //         CELL_1: {
  //           ...rowGroupState.rows.ROW_1.cells.CELL_1,
  //           ...resetLetterColor
  //         },
  //         CELL_2: {
  //           ...rowGroupState.rows.ROW_1.cells.CELL_2,
  //           ...resetLetterColor
  //         },
  //         CELL_3: {
  //           ...rowGroupState.rows.ROW_1.cells.CELL_3,
  //           ...resetLetterColor
  //         },
  //         CELL_4: {
  //           ...rowGroupState.rows.ROW_1.cells.CELL_4,
  //           ...resetLetterColor
  //         },
  //         CELL_5: {
  //           ...rowGroupState.rows.ROW_1.cells.CELL_5,
  //           ...resetLetterColor
  //         },
  //       },
  //     },
  //   },
  // };

  // dispatch(resetCellsByRowId('ROW_1' as RowKey));
  // dispatch(resetCellsByRowId('ROW_2' as RowKey));
  // dispatch(resetCellsByRowId('ROW_3' as RowKey));
  // dispatch(resetCellsByRowId('ROW_4' as RowKey));
  // dispatch(resetCellsByRowId('ROW_5' as RowKey));
  // dispatch(resetCellsByRowId('ROW_6' as RowKey));
  dispatch(resetCellsForAllRows());
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
type UpdateWordPayload = { word: Array<string>; rowKey: RowKey };
type UpdateWordColorPayload = { color: Array<string>; rowKey: RowKey };

export const rowGroupSlice = createSlice({
  name: 'ui_rowgroup',
  initialState,
  reducers: {
    // resetRowGroup: () => {
    //   return { ...initialState };
    // },
    resetCellsForAllRows: (state) => {
      const allRows = state.rows;
      Object.keys(allRows).forEach((row) => { 
        const rowCells = allRows[row as RowKey].cells;  
        Object.keys(rowCells).forEach((cell) => {
          rowCells[cell as CellKey].letter = '';
          rowCells[cell as CellKey].color = CELL_COLORS.GREY_OUTLINE;
        });
      });
    },
    resetCellsByRowId: (state, action: PayloadAction<RowKey>) => {
      const rowCells = state.rows[action.payload].cells;
      Object.keys(rowCells).forEach((cell) => {
        rowCells[cell as CellKey].letter = '';
        rowCells[cell as CellKey].color = CELL_COLORS.GREY_OUTLINE;
      });
    },
    updateWordByRowId: (state, action: PayloadAction<UpdateWordPayload>) => {
      const { rowKey, word } = action.payload;
      state.rows[rowKey].cells['CELL_1'].letter = word[0];
      state.rows[rowKey].cells['CELL_2'].letter = word[1];
      state.rows[rowKey].cells['CELL_3'].letter = word[2];
      state.rows[rowKey].cells['CELL_4'].letter = word[3];
      state.rows[rowKey].cells['CELL_5'].letter = word[4];
    },
    updateWordColorsByRowId: (
      state,
      action: PayloadAction<UpdateWordColorPayload>
    ) => {
      const { rowKey, color } = action.payload;

      state.rows[rowKey].cells = {
        CELL_1: {
          ...state.rows[rowKey].cells.CELL_1,
          color: CELL_COLORS[color[0] as KeyboardColor],
        },
        CELL_2: {
          ...state.rows[rowKey].cells.CELL_2,
          color: CELL_COLORS[color[1] as KeyboardColor],
        },
        CELL_3: {
          ...state.rows[rowKey].cells.CELL_3,
          color: CELL_COLORS[color[2] as KeyboardColor],
        },
        CELL_4: {
          ...state.rows[rowKey].cells.CELL_4,
          color: CELL_COLORS[color[3] as KeyboardColor],
        },
        CELL_5: {
          ...state.rows[rowKey].cells.CELL_5,
          color: CELL_COLORS[color[4] as KeyboardColor],
        },
      };
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
  // resetRowGroup,
  resetCellsForAllRows,
  resetCellsByRowId,
  updateLetterByRowAndCellId,
  updateColorByRowAndCellId,
  updateWordByRowId,
  updateWordColorsByRowId,
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
