import React from 'react';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import WordleRow from '../row/WordleRow';
import { setAnimateInvalidWord } from '../../wordleversus/wordleVersusSlice';
import { ROW_IDS } from './RowGroup.types';

const RowGroup: React.FunctionComponent = () => {
  const dispatch = useAppDispatch();

  const onAnimationEnd = () => dispatch(setAnimateInvalidWord(false));

  return (
    <>
      <WordleRow rowId={ROW_IDS.ROW_1} onAnimationEnd={onAnimationEnd} />
      <WordleRow rowId={ROW_IDS.ROW_2} onAnimationEnd={onAnimationEnd} />
      <WordleRow rowId={ROW_IDS.ROW_3} onAnimationEnd={onAnimationEnd} />
      <WordleRow rowId={ROW_IDS.ROW_4} onAnimationEnd={onAnimationEnd} />
      <WordleRow rowId={ROW_IDS.ROW_5} onAnimationEnd={onAnimationEnd} />
      <WordleRow rowId={ROW_IDS.ROW_6} onAnimationEnd={onAnimationEnd} />
    </>
  );
};

export default RowGroup;
