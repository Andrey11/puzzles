import React, { useEffect, useRef, useState } from 'react';
// import Accordion from 'react-bootstrap/Accordion';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { Robot, Book, BookHalf, Diagram3 } from 'react-bootstrap-icons';

import { allAvailableWords } from './PuzzleWords';
import { IAnalyzerData, WordleScreen } from './PuzzleWordle.types';
import PuzzleDetailsStats from './components/stats/PuzzleDetailsStats';
import PuzzleDetailsSolver from './components/solver/PuzzleWordleSolver';

// import useDeviceDetect from '../../app/hooks/useDeviceDetect';

import styles from './PuzzleWordle.module.scss';
import PuzzleDictionary from './components/dictionary/WordleDictionary';
import { createDictionary, getActiveScreen, isDictionaryLoaded, setActiveScreen } from './wordleSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks/hooks';
import { setActivePuzzle } from '../../app/appSlice';
import { PuzzleType } from '../../app/App.types';

const NON_BREAKING_SPACE: JSX.Element = <>&nbsp;</>;

const PuzzleWordle: React.FunctionComponent = () => {
  const bodyContainerRef = useRef(null);

  const dispatch = useAppDispatch();
  const dictionaryLoaded = useAppSelector(isDictionaryLoaded);
  const activeScreen = useAppSelector(getActiveScreen);

  const [loaded, setLoaded] = useState<boolean>(dictionaryLoaded);
  // const [dictionaryWords, setDictionaryWords] = useState<IPuzzleDictionary>(initialDictionary);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [analyzerData, setAnalyzerData] = useState<IAnalyzerData>({});
  // const [lastSolution, setLastSolution] = useState<IPuzzleSolution>();
  // const [activeDisplayItem, setActiveDisplayItem] = useState<string>('0');

  // const { isMobile, isDeviceWidthXL } = useDeviceDetect();

  useEffect(() => {
    if (!loaded) {
      console.log('[PuzzleDetailsScene] initialized');
      setLoaded(true);
      dispatch(createDictionary(allAvailableWords));
      dispatch(setActivePuzzle(PuzzleType.WORDLE));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

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

  const renderDictionaryHeading = () => (
    <span className={styles.HeaderLabel}>
      Dictionary {NON_BREAKING_SPACE}
      {activeScreen === WordleScreen.DICTIONARY ? <BookHalf size={18} /> : <Book size={18} />}
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
        <Tab eventKey={WordleScreen.DICTIONARY} title={renderDictionaryHeading()}>
          <PuzzleDictionary />
        </Tab>
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

export default PuzzleWordle;
