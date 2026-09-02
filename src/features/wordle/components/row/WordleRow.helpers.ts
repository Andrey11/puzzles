import { ROW_IDS, RowKey } from 'features/wordle/components/rowgroup/RowGroup.types';

export const toRowId = (rowId: ROW_IDS) => ROW_IDS[rowId as number] as RowKey;
