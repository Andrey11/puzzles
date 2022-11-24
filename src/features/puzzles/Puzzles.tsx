import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { IPuzzleCardProps, PUZZLES } from 'app/App.types';
import {
  getActivePuzzle,
  getPuzzleCards,
  isHeaderItemActionByType,
  setActivePuzzle,
  setHeaderItemAction,
  setHeaderItems,
  setHeaderTitle,
  setShowHeaderDictionaryIcon,
} from 'app/appSlice';
import { useAppDispatch, useAppSelector } from 'app/hooks/hooks';
import { RootState } from 'app/store';

import PuzzleCard from 'components/card/PuzzleCard';
import { IHeaderItem } from 'components/header/PuzzleHeader';
import {
  createDictionary,
  getDictionaryStatus,
  isDictionaryLoaded,
} from 'features/wordle/components/dictionary/wordleDictionarySlice';
import { getLogStyles } from 'features/wordle/PuzzleWordle-helpers';

import styles from './Puzzles.module.scss';

const PuzzlesLog = getLogStyles({
  cmpName: 'Puzzles',
  cmpNameCls: 'color: #23232A; font-weight: bold;',
});

const PuzzlesHeaderSettings: Array<IHeaderItem> = [
  {
    itemTitle: 'Help',
    itemId: 'HelpButton',
    itemPosition: 'RIGHT',
    iconName: 'QuestionCircle',
    isButton: false,
    isIcon: true,
    icon: 'QuestionCircle',
    itemAction: 'ACTION_HELP',
  },
];

const Puzzles: React.FC = () => {
  const dispatch = useAppDispatch();

  const [isInit, setIsInit] = useState<boolean>(false);

  const puzzleCards = useAppSelector(getPuzzleCards);
  const activePuzzle = useAppSelector(getActivePuzzle);

  const dictionaryLoaded = useAppSelector(isDictionaryLoaded);
  const dictionaryStatus = useAppSelector(getDictionaryStatus);

  const isHelpHeaderAction = useSelector((state: RootState) =>
    isHeaderItemActionByType(state, 'ACTION_HELP')
  );

  useEffect(() => {
    if (!isInit) {
      setIsInit(true);
      // console.log(...PuzzleLog.logSuccess('initializing'));
    } else if (isInit && activePuzzle !== PUZZLES.LOBBY) {
      dispatch(setActivePuzzle(PUZZLES.LOBBY));
      dispatch(setHeaderTitle('PUZZLES!!!'));
      dispatch(setHeaderItems(PuzzlesHeaderSettings));
      dispatch(setShowHeaderDictionaryIcon(false));
      console.log(...PuzzlesLog.logAction('activating puzzle lobby'));
    }
  }, [isInit, activePuzzle, dispatch]);

  useEffect(() => {
    if (!dictionaryLoaded && dictionaryStatus !== 'loaded' && isInit) {
      dispatch(createDictionary());
      console.log(...PuzzlesLog.logAction('creating wordle dictionary'));
    } else if (dictionaryLoaded && dictionaryStatus === 'loaded' && isInit) {
      console.log(...PuzzlesLog.logSuccess('wordle dictionary loaded'));
    }
  }, [dictionaryLoaded, dictionaryStatus, dispatch, isInit]);

  /** HEADER ACTION HANDLERS EFFECT */
  useEffect(() => {
    if (isHelpHeaderAction) {
      console.log(
        ...PuzzlesLog.logAction('help button in header was pressed')
      );
      dispatch(setHeaderItemAction(''));
    }
  }, [dispatch, isHelpHeaderAction]);

  const renderPuzzleCards = () =>
    puzzleCards.map((cardProps: IPuzzleCardProps) => (
      <PuzzleCard key={cardProps.puzzleName} {...cardProps} />
    ));

  return (
    <div className={styles.PuzzlesCardContainer}>{renderPuzzleCards()}</div>
  );
};

export default Puzzles;
