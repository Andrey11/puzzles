export enum CELL_COLORS {
  GREEN = 'success',
  GREEN_OUTLINE = 'outline-success',
  ORANGE = 'warning',
  ORANGE_OUTLINE = 'outline-warning',
  GREY = 'secondary',
  GREY_OUTLINE = 'outline-secondary',
}

export enum ROW_IDS {
  ROW_1 = 1,
  ROW_2 = 2,
  ROW_3 = 3,
  ROW_4 = 4,
  ROW_5 = 5,
  ROW_6 = 6,
}

export enum CELL_IDS {
  CELL_1 = 1, 
  CELL_2 = 2, 
  CELL_3 = 3, 
  CELL_4 = 4, 
  CELL_5 = 5,
}

export type RowKey = keyof typeof ROW_IDS;
export type CellKey = keyof typeof CELL_IDS;

export interface IWordleRowCellUI {
  cellId: CELL_IDS;
  rowId: ROW_IDS;
  letter: string;
  color: CELL_COLORS;
  disabled?: boolean;
  prevCellId?: CELL_IDS | null;
  nextCellId?: CELL_IDS | null;
}

export interface IWordleRowUI {
  rowId: ROW_IDS;
  cells: Record<CellKey, IWordleRowCellUI>;
  disabled?: boolean;
  showInvalidWordAnimation?: boolean | false;
  prevRowId?: ROW_IDS | null;
  nextRowId?: ROW_IDS | null;

  /** @deprecated */
  letters?: Array<string>;
  /** @deprecated */
  colors?: Array<string>;
}

export interface IWordleRowGroupUI {
  rows: Record<RowKey, IWordleRowUI>;
}
