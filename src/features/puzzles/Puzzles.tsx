import React, { useEffect, useState } from 'react';
import { IPuzzleCardProps, PUZZLES } from '../../app/App.types';
import {
  getActivePuzzle,
  getPuzzleCards,
  setActivePuzzle,
} from '../../app/appSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks/hooks';

import PuzzleCard from '../../components/card/PuzzleCard';
import {
  createDictionary,
  getDictionaryStatus,
  isDictionaryLoaded,
} from '../wordle/components/dictionary/wordleDictionarySlice';
import { getLogStyles } from '../wordle/PuzzleWordle-helpers';

import styles from './Puzzles.module.scss';

const PuzzleLog = getLogStyles({
  cmpName: 'Puzzles',
  cmpNameCls: 'color: #23232A; font-weight: bold;',
});

const Puzzles: React.FC = () => {
  const dispatch = useAppDispatch();

  const [isInit, setIsInit] = useState<boolean>(false);

  const puzzleCards = useAppSelector(getPuzzleCards);
  const activePuzzle = useAppSelector(getActivePuzzle);

  const dictionaryLoaded = useAppSelector(isDictionaryLoaded);
  const dictionaryStatus = useAppSelector(getDictionaryStatus);

  useEffect(() => {
    if (!isInit) {
      setIsInit(true);
      // console.log(...PuzzleLog.logSuccess('initializing'));
    } else if (isInit && activePuzzle !== PUZZLES.NONE) {
      dispatch(setActivePuzzle(PUZZLES.NONE));
      console.log(...PuzzleLog.logAction('activating puzzle lobby'));
    }
  }, [isInit, activePuzzle, dispatch]);

  useEffect(() => {
    if (!dictionaryLoaded && dictionaryStatus !== 'loaded' && isInit) {
      dispatch(createDictionary());
      console.log(...PuzzleLog.logAction('creating wordle dictionary'));
    } else if (dictionaryLoaded && dictionaryStatus === 'loaded' && isInit) {
      console.log(...PuzzleLog.logSuccess('wordle dictionary loaded'));
    }
  }, [dictionaryLoaded, dictionaryStatus, dispatch, isInit]);

  const renderPuzzleCards = () =>
    puzzleCards.map((cardProps: IPuzzleCardProps) => (
      <PuzzleCard key={cardProps.puzzleName} {...cardProps} />
    ));

  return (
    <div className={styles.PuzzlesCardContainer}>{renderPuzzleCards()}</div>
  );
};

export default Puzzles;
