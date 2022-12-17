import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppSelector } from 'app/hooks/hooks';
import { RootState } from '../../../../app/store';
import PuzzleWordleCell from '../cell/PuzzleWordleCell';
import { CellKey, IWordleRowCellUI, IWordleRowUI, RowKey, ROW_IDS } from '../rowgroup/RowGroup.types';
import { getRowById } from '../rowgroup/rowGroupSlice';
import { getCurrentRoundAsNumber } from '../../wordleversus/game/wordleVersusGameSlice';
import { showInvalidWordAnimation } from '../../wordleversus/wordleVersusSlice';
import styles from './WordleRow.module.scss';
import { getLogStyles, numberToCellKey } from 'features/wordle/PuzzleWordle-helpers';

interface IRowProps {
  rowId: ROW_IDS;
  rowNumber?: number;
  onAnimationEnd?: () => void;
  animatonDuration?: number;
  canSelectCells?: boolean;
  onCellSelected?: (rowKey: ROW_IDS, cellKey: CellKey) => void;
}

const WordleRowLog = getLogStyles({
  cmpName: 'WordleRow',
  cmpNameCls: 'color: #9c23ed; font-weight: bold;',
});

export const toRowId = (rowId: ROW_IDS) => ROW_IDS[rowId as number] as RowKey;

const WordleRow: React.FunctionComponent<IRowProps> = ({
  rowId,
  canSelectCells = false,
  onCellSelected = () => {},
  onAnimationEnd = () => {},
  animatonDuration = 2100,
}: IRowProps) => {
  const notificationRef = useRef(null);

  const guessRow: IWordleRowUI = useSelector((state: RootState) => getRowById(state, toRowId(rowId)));
  const { cells } = guessRow;

  const currentGuessNum = useAppSelector(getCurrentRoundAsNumber);
  const animateInvalidWord = useAppSelector(showInvalidWordAnimation);

  const [notificationCls, setNotificationCls] = useState(styles.WordleRowWrapper);

  useEffect(() => {
    let invalidClass = '';
    if (animateInvalidWord && currentGuessNum === rowId) {
      invalidClass = styles.InvalidWord;
      console.log(...WordleRowLog.logAction(`useEffect | play error animation in row ${rowId}`));

      setTimeout(() => {
        console.log(...WordleRowLog.logSuccess(`useEffect | invalid animation end in row ${rowId}`));
        onAnimationEnd();
      }, animatonDuration);
    }

    setNotificationCls(`${styles.WordleRowWrapper} ${invalidClass}`);
  }, [animatonDuration, onAnimationEnd, animateInvalidWord, currentGuessNum, rowId]);


  const onCellSelectedHandler = (cellId: number) => {
    onCellSelected(rowId, numberToCellKey(cellId))
  };

  const renderWorleCell = (cellId: string, cell?: IWordleRowCellUI) => (
    <PuzzleWordleCell
          cellId={cellId}
          cell={cell}
          showSelected={canSelectCells}
          onCellSelected={onCellSelectedHandler}
        />
  );

  return (
    <div className={notificationCls}>
      <div ref={notificationRef} className={styles.WordleRowDisplay}>
        {renderWorleCell('1', cells.CELL_1)}
        {renderWorleCell('2', cells.CELL_2)}
        {renderWorleCell('3', cells.CELL_3)}
        {renderWorleCell('4', cells.CELL_4)}
        {renderWorleCell('5', cells.CELL_5)}
      </div>
    </div>
  );
};

export default WordleRow;
