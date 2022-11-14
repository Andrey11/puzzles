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
import { useAppDispatch, useAppSelector } from '../../../app/hooks/hooks';
import { getActivePuzzle, setActivePuzzle } from '../../../app/appSlice';
import { PUZZLES } from '../../../app/App.types';

import { createDictionary, getDictionaryStatus, isDictionaryLoaded } from '../components/dictionary/wordleDictionarySlice';
import { getLogStyles } from '../PuzzleWordle-helpers';

const NON_BREAKING_SPACE: JSX.Element = <>&nbsp;</>;

const WordleSolverLog = getLogStyles({
  cmpName: 'PuzzleWordleSolver',
  cmpNameCls: 'color: #399e25; font-weight: bold;',
});

const PuzzleWordleSolver: React.FunctionComponent = () => {
  const bodyContainerRef = useRef(null);

  const dispatch = useAppDispatch();
  const dictionaryLoaded = useAppSelector(isDictionaryLoaded);
  const dictionaryStatus = useAppSelector(getDictionaryStatus);
  // const dictionaryLoaded = useAppSelector(isDictionaryLoaded);
  const activeScreen = useAppSelector(getActiveScreen);
  const activePuzzle = useAppSelector(getActivePuzzle);

  const [isInit, setIsInit] = useState<boolean>(false);
  // const [loaded, setLoaded] = useState<boolean>(dictionaryLoaded);
  // const [dictionaryWords, setDictionaryWords] = useState<IPuzzleDictionary>(initialDictionary);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [analyzerData, setAnalyzerData] = useState<IAnalyzerData>({});
  // const [lastSolution, setLastSolution] = useState<IPuzzleSolution>();
  // const [activeDisplayItem, setActiveDisplayItem] = useState<string>('0');

  // const { isMobile, isDeviceWidthXL } = useDeviceDetect();

  useEffect(() => {
    if (!isInit) {
      setIsInit(true);
      // console.log(...WordleSolverLog.logSuccess('initializing'));
    } else if (isInit && activePuzzle !== PUZZLES.WORDLE) {
      dispatch(setActivePuzzle(PUZZLES.WORDLE));
      console.log(...WordleSolverLog.logAction('activating wordle solver'));
    }
  }, [isInit, activePuzzle, dispatch]);

  useEffect(() => {
    if (!dictionaryLoaded && dictionaryStatus !== 'loaded' && isInit) {
      dispatch(createDictionary());
      console.log(...WordleSolverLog.logAction('creating wordle dictionary'));
    } else if (dictionaryLoaded && dictionaryStatus === 'loaded' && isInit) {
      console.log(...WordleSolverLog.logSuccess('wordle dictionary loaded'));
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

  // const renderDictionaryHeading = () => (
  //   <span className={styles.HeaderLabel}>
  //     Dictionary {NON_BREAKING_SPACE}
  //     {activeScreen === WordleScreen.DICTIONARY ? <BookHalf size={18} /> : <Book size={18} />}
  //   </span>
  // );

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

  // const renderAccordionDisplayContainer = (): JSX.Element => {
  //   return (
  //     <Accordion
  //       // flush={isDeviceWidthXXS()}
  //       flush
  //       className="h-100"
  //       activeKey={activeScreen as unknown as string}
  //       onSelect={(eventKey) => dispatch(setActiveScreen(eventKey as unknown as WordleScreen))}
  //     >
  //       <Accordion.Item eventKey={DISPLAY_ITEM_PUZZLE}>
  //         <Accordion.Header as={'h6'}>{renderPuzzleSolverHeading()}</Accordion.Header>
  //         <Accordion.Body ref={bodyContainerRef} className={styles.RelativePosition}>
  //           {renderPuzzleSolver()}
  //         </Accordion.Body>
  //       </Accordion.Item>
  //       <Accordion.Item eventKey={DISPLAY_ITEM_STATS}>
  //         <Accordion.Header as={'h6'}>{renderStatsHeading()}</Accordion.Header>
  //         <Accordion.Body>{renderPuzzleStats()}</Accordion.Body>
  //       </Accordion.Item>
  //       <Accordion.Item eventKey={DISPLAY_ITEM_DICTIONARY}>
  //         <Accordion.Header as={'h6'}>{renderDictionaryHeading()}</Accordion.Header>
  //         <Accordion.Body>
  //           <PuzzleDictionary />
  //         </Accordion.Body>
  //       </Accordion.Item>
  //     </Accordion>
  //   );
  // };

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
        {/* <Tab eventKey={WordleScreen.DICTIONARY} title={renderDictionaryHeading()}>
          <PuzzleDictionary />
        </Tab> */}
      </Tabs>
    );
  };

  // const renderPlatformDisplayContainer = () => {
  //   // if (isMobile && isDeviceWidthXL()) {
  //   //   return renderAccordionDisplayContainer();
  //   // } else {
  //     return renderTabDisplayContainer();
  //   // }
  // };

  return <div className={styles.PuzzleScene}>{renderTabDisplayContainer()}</div>;
};

export default PuzzleWordleSolver;
