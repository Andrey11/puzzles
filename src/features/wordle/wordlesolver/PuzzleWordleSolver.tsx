import React, { useEffect, useRef, useState } from 'react';
// import Accordion from 'react-bootstrap/Accordion';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { Robot, Diagram3 } from 'react-bootstrap-icons';
import { IAnalyzerData, WordleScreen } from '../PuzzleWordle.types';
import PuzzleDetailsStats from '../components/stats/PuzzleDetailsStats';
import PuzzleDetailsSolver from '../components/solver/WordleSolver';

// import useDeviceDetect from '../../app/hooks/useDeviceDetect';

import styles from './PuzzleWordleSolver.module.scss';
import { getActiveScreen, setActiveScreen } from './wordleSlice';
import { useAppDispatch, useAppSelector } from 'app/hooks/hooks';
import { getActivePuzzle, isHeaderItemActionByType, setActivePuzzle, setHeaderItemAction, setHeaderItems, setHeaderTitle, setShowHeaderDictionaryIcon } from '../../../app/appSlice';
import { PUZZLES } from '../../../app/App.types';

import { createDictionary, getDictionaryStatus, isDictionaryLoaded } from '../components/dictionary/wordleDictionarySlice';
import { getLogStyles } from '../PuzzleWordle-helpers';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { IHeaderItem } from '../../../components/header/PuzzleHeader';
import { NON_BREAKING_SPACE } from '../../../components/placeholder/Placeholder';

const WordleSolverLog = getLogStyles({
  cmpName: 'PuzzleWordleSolver',
  cmpNameCls: 'color: #399e25; font-weight: bold;',
});

const WordleSolverHeaderSettings: Array<IHeaderItem> = [
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
  const bodyContainerRef = useRef(null);

  const dispatch = useAppDispatch();
  const dictionaryLoaded = useAppSelector(isDictionaryLoaded);
  const dictionaryStatus = useAppSelector(getDictionaryStatus);
  // const dictionaryLoaded = useAppSelector(isDictionaryLoaded);
  const activeScreen = useAppSelector(getActiveScreen);
  const activePuzzle = useAppSelector(getActivePuzzle);

  const isHelpHeaderAction = useSelector((state: RootState) =>
    isHeaderItemActionByType(state, 'ACTION_HELP')
  );

  const [isInit, setIsInit] = useState<boolean>(false);
  // const [loaded, setLoaded] = useState<boolean>(dictionaryLoaded);
  // const [dictionaryWords, setDictionaryWords] = useState<IPuzzleDictionary>(initialDictionary);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [analyzerData, setAnalyzerData] = useState<IAnalyzerData>({});
  // const [lastSolution, setLastSolution] = useState<IPuzzleSolution>();
  // const [activeDisplayItem, setActiveDisplayItem] = useState<string>('0');

  // const { isMobile, isDeviceWidthXL } = useDeviceDetect();

  /** PUZZLE ACTIVATION ON LOAD EFFECT */
  useEffect(() => {
    if (!isInit) {
      setIsInit(true);
      // console.log(...WordleSolverLog.logSuccess('initializing'));
    } else if (isInit && activePuzzle !== PUZZLES.WORDLE) {
      dispatch(setActivePuzzle(PUZZLES.WORDLE));
      dispatch(setHeaderTitle('Wordle Solver'));
      dispatch(setHeaderItems(WordleSolverHeaderSettings));
      console.log(...WordleSolverLog.logAction('activating wordle solver'));
    }
  }, [isInit, activePuzzle, dispatch]);

  /** HEADER ACTION HANDLERS EFFECT */
  useEffect(() => {
    if (isHelpHeaderAction) {
      dispatch(setHeaderItemAction(''));
      console.log(
        ...WordleSolverLog.logAction('help button in header was pressed')
      );
    }
  }, [dispatch, isHelpHeaderAction]);

  /** START GAME STATE / DICTIONARY LOADED EFFECT */
  useEffect(() => {
    if (!dictionaryLoaded && dictionaryStatus !== 'loaded' && isInit) {
      dispatch(createDictionary());
      console.log(...WordleSolverLog.logAction('creating wordle dictionary'));
    } else if (dictionaryLoaded && dictionaryStatus === 'loaded' && isInit) {
      console.log(...WordleSolverLog.logSuccess('wordle dictionary loaded'));
      dispatch(setShowHeaderDictionaryIcon(true));
    }
  }, [dictionaryLoaded, dictionaryStatus, dispatch, isInit]);

  const analyzerHandler = (analyzerData: IAnalyzerData) => {
    setAnalyzerData(analyzerData);
    if (analyzerData.shouldAnalyze) {
      dispatch(setActiveScreen(WordleScreen.ANALYZER));
    }
  };

  const renderPuzzleSolverHeading = () => (
    <span className={styles.HeaderLabel}>
      Solver {NON_BREAKING_SPACE}
      <Robot size={18} />
    </span>
  );

  const renderStatsHeading = () => (
    <span className={styles.HeaderLabel}>
      Stats {NON_BREAKING_SPACE}
      <Diagram3 size={18} />
    </span>
  );

  const renderPuzzleSolver = () => (
    <PuzzleDetailsSolver
      analyzeSolutionHandler={analyzerHandler}
    />
  );

  const renderPuzzleStats = () => (
    <PuzzleDetailsStats analyzeSolution={analyzerData} />
  );

  const renderTabDisplayContainer = () => {
    return (
      <Tabs
        activeKey={activeScreen}
        onSelect={(eventKey) => dispatch(setActiveScreen(eventKey as unknown as WordleScreen))}
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
