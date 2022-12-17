import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'app/hooks/hooks';
import { RootState } from 'app/store';
import { PUZZLES } from 'app/App.types';

import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { Robot, Diagram3 } from 'react-bootstrap-icons';

import { IHeaderItem } from 'components/header/PuzzleHeader';
import { NON_BREAKING_SPACE } from 'components/placeholder/Placeholder';

import {
  getActivePuzzle,
  isHeaderItemActionByType,
  setActivePuzzle,
  setHeaderItemAction,
  setHeaderItems,
  setHeaderTitle,
  setShowHeaderDictionaryIcon,
} from 'app/appSlice';

import { getActiveScreen, updateActiveScreen } from './wordleSlice';

import { WordleScreen } from 'features/wordle/PuzzleWordle.types';
import { getLogStyles } from 'features/wordle/PuzzleWordle-helpers';

import WordleStats from 'features/wordle/components/stats/WordleStats';
import PuzzleDetailsSolver from 'features/wordle/components/solver/WordleSolver';

import {
  createDictionary,
  getDictionaryStatus,
  isDictionaryLoaded,
} from 'features/wordle/components/dictionary/wordleDictionarySlice';

import styles from './PuzzleWordleSolver.module.scss';
import { setShowClearKey } from 'components/keyboard/puzzlesKeyboardSlice';

const WordleSolverLog = getLogStyles({
  cmpName: 'PuzzleWordleSolver',
  cmpNameCls: 'color: #399e25; font-weight: bold;',
});

const WordleSolverHeaderSettings: Array<IHeaderItem> = [
  {
    itemTitle: 'Back to Puzzles',
    itemId: 'BackButton',
    itemPosition: 'LEFT',
    iconName: 'PuzzleFill',
    isButton: false,
    isIcon: true,
    icon: 'PuzzleFill',
    tooltipText: 'Back to Puzzles Lobby',
    itemAction: 'ACTION_BACK',
  },
  {
    itemTitle: 'Help',
    itemId: 'HelpButton',
    itemPosition: 'RIGHT',
    iconName: 'QuestionCircle',
    isButton: false,
    isIcon: true,
    icon: 'QuestionCircle',
    tooltipText: 'Puzzle Help',
    itemAction: 'ACTION_HELP',
  },
];

const PuzzleWordleSolver: React.FunctionComponent = () => {
  const navigate: NavigateFunction = useNavigate();
  const bodyContainerRef = useRef(null);

  const dispatch = useAppDispatch();
  const dictionaryLoaded = useAppSelector(isDictionaryLoaded);
  const dictionaryStatus = useAppSelector(getDictionaryStatus);
  const activeScreen = useAppSelector(getActiveScreen);
  const activePuzzle = useAppSelector(getActivePuzzle);

  const isHelpHeaderAction = useSelector((state: RootState) => isHeaderItemActionByType(state, 'ACTION_HELP'));
  const isBackHeaderAction = useSelector((state: RootState) => isHeaderItemActionByType(state, 'ACTION_BACK'));

  const [isInit, setIsInit] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);

  /** PUZZLE ACTIVATION ON LOAD EFFECT */
  useEffect(() => {
    if (!isInit) {
      setIsInit(true);
      // console.log(...WordleSolverLog.logSuccess('initializing'));
    } else if (isInit && activePuzzle !== PUZZLES.WORDLE) {
      dispatch(setActivePuzzle(PUZZLES.WORDLE));
      dispatch(setHeaderTitle('Wordle Solver'));
      dispatch(setHeaderItems(WordleSolverHeaderSettings));
      dispatch(setShowClearKey(true));
      console.log(...WordleSolverLog.logAction('activating wordle solver'));
    }
  }, [isInit, activePuzzle, dispatch]);

  /** HEADER ACTION HANDLERS EFFECT */
  useEffect(() => {
    if (isHelpHeaderAction) {
      dispatch(setHeaderItemAction(''));
      console.log(...WordleSolverLog.logAction('help button in header was pressed'));
    } else if (isBackHeaderAction) {
      console.log(...WordleSolverLog.logAction('back button in header was pressed'));
      dispatch(setHeaderItemAction(''));
      navigate(-1);
    }
  }, [dispatch, isBackHeaderAction, isHelpHeaderAction, navigate]);

  /** START GAME STATE / DICTIONARY LOADED EFFECT */
  useEffect(() => {
    if (!isInit) return;

    if (!dictionaryLoaded && dictionaryStatus !== 'loading') {
      dispatch(createDictionary());
      console.log(...WordleSolverLog.logAction('creating wordle dictionary'));
    } else if (dictionaryLoaded && dictionaryStatus === 'loaded' && isInit) {
      console.log(...WordleSolverLog.logSuccess('wordle dictionary loaded'));
      dispatch(setShowHeaderDictionaryIcon(true));
      setIsReady(true);
    }
  }, [dictionaryLoaded, dictionaryStatus, dispatch, isInit]);

  const renderPuzzleSolverHeading = () => (
    <span className={styles.HeaderLabel}>
      Solver {NON_BREAKING_SPACE}
      <Robot size={18} />
    </span>
  );

  const renderStatsHeading = () => (
    <span className={styles.HeaderLabel}>
      Analysis {NON_BREAKING_SPACE}
      <Diagram3 size={18} />
    </span>
  );

  const renderPuzzleSolver = () => <PuzzleDetailsSolver isReady={isReady} />;

  const renderPuzzleStats = () => <WordleStats isReady={isReady} />;

  const renderTabDisplayContainer = () => {
    return (
      <Tabs
        activeKey={activeScreen}
        onSelect={(eventKey) => dispatch(updateActiveScreen(eventKey as unknown as WordleScreen))}
        className="mb-3"
        fill
      >
        <Tab eventKey={WordleScreen.SOLVER} title={renderPuzzleSolverHeading()} className={styles.RelativePosition}>
          <div ref={bodyContainerRef}>{renderPuzzleSolver()}</div>
        </Tab>
        <Tab eventKey={WordleScreen.ANALYZER} title={renderStatsHeading()}>
          {renderPuzzleStats()}
        </Tab>
      </Tabs>
    );
  };

  return <div className={styles.PuzzleScene}>{renderTabDisplayContainer()}</div>;
};

export default PuzzleWordleSolver;
