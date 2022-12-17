import React from 'react';
import { useAppDispatch } from 'app/hooks/hooks';
import WordleRow from '../row/WordleRow';
import { setAnimateInvalidWord } from '../../wordleversus/wordleVersusSlice';
import { CellKey, ROW_IDS } from './RowGroup.types';

interface RowGroupProps {
  /** Number of rows to render, defaults to 6 rows */
  rowCount?: number;
  /** Enable user to select cells */
  canSelectCells?: boolean;
  /** Callback when user taps on a cell */
  onCellSelected?: (rowKey: ROW_IDS, cellKey: CellKey) => void;
}

const RowGroup: React.FC<RowGroupProps> = ({ rowCount, canSelectCells, onCellSelected }: RowGroupProps) => {
  const dispatch = useAppDispatch();

  const onAnimationEnd = () => dispatch(setAnimateInvalidWord(false));
  const visibleRowCount: number = rowCount ? Math.min(rowCount, 6) : 6;

  const renderWordleRow = (rowId: ROW_IDS) => (
    <WordleRow
      rowId={rowId}
      canSelectCells={canSelectCells}
      onCellSelected={onCellSelected}
      onAnimationEnd={onAnimationEnd}
    />
  );

  return (
    <>
      {visibleRowCount >= ROW_IDS.ROW_1 && renderWordleRow(ROW_IDS.ROW_1)}
      {visibleRowCount >= ROW_IDS.ROW_2 && renderWordleRow(ROW_IDS.ROW_2)}
      {visibleRowCount >= ROW_IDS.ROW_3 && renderWordleRow(ROW_IDS.ROW_3)}
      {visibleRowCount >= ROW_IDS.ROW_4 && renderWordleRow(ROW_IDS.ROW_4)}
      {visibleRowCount >= ROW_IDS.ROW_5 && renderWordleRow(ROW_IDS.ROW_5)}
      {visibleRowCount >= ROW_IDS.ROW_6 && renderWordleRow(ROW_IDS.ROW_6)}
    </>
  );
};

export default RowGroup;
