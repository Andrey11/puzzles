import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'app/hooks/hooks';

import { getLogStyles } from 'features/wordle/PuzzleWordle-helpers';

import RowGroup from 'features/wordle/components/rowgroup/RowGroup';

import RobotSolver from 'features/wordle/components/robot/RobotSolver';
import InteractiveRobot from 'features/wordle/components/robot/InteractiveRobot';

import { setRobotStartingWord } from 'features/wordle/components/robot/robotSolutionSlice';
import { isDictionaryLoaded } from 'features/wordle/components/dictionary/wordleDictionarySlice';
import {
  isScreenSolverActive,
  setShouldShowSelectSolverWordsOverlay,
  shouldShowEndSolverGameOverlay,
  shouldShowRobot,
  shouldShowSelectSolverWordsOverlay,
} from 'features/wordle/wordlesolver/wordleSlice';
import {
  addRobotWord,
  isLostGame,
  isWonGame,
  onSubmitRobotGuess,
  resetWordleSolverGame,
  setWOD,
  shouldRobotSolvePuzzle,
} from './wordleSolverSlice';

import styles from './WordleSolver.module.scss';

const WordleSolverLog = getLogStyles({
  cmpName: 'WordleSolver',
  cmpNameCls: 'color: #361e25; font-weight: bold;',
});

type IPuzzleWordleSolverProps = {
  isReady?: boolean;
};

const WordleSolver: React.FunctionComponent<IPuzzleWordleSolverProps> = ({
  isReady = false,
}: IPuzzleWordleSolverProps) => {
  const overlayRef: React.RefObject<any> = useRef(null);
  const guessRowTargetRef: React.RefObject<any> = useRef(null);

  const dictionaryLoaded = useAppSelector(isDictionaryLoaded);
  const shouldSolvePuzzle = useAppSelector(shouldRobotSolvePuzzle);
  const showRobot = useAppSelector(shouldShowRobot);
  const showSelectSolverWordsOverlay = useAppSelector(shouldShowSelectSolverWordsOverlay);
  const showEndSolverGameOverlay = useAppSelector(shouldShowEndSolverGameOverlay);
  const isActiveTab = useAppSelector(isScreenSolverActive);

  const isWon = useAppSelector(isWonGame);
  const isLost = useAppSelector(isLostGame);

  const dispatch = useAppDispatch();

  const [isSolverReady, setSolverReady] = useState<boolean>(false);

  useEffect(() => {
    if (!isReady) return;

    if (isActiveTab) {
      console.log(...WordleSolverLog.logAction('tab solver is active'));
      dispatch(resetWordleSolverGame());
      setSolverReady(showRobot);
    } else {
      console.log(...WordleSolverLog.logAction('tab solver is not active'));
      setSolverReady(false);
    }
  }, [dispatch, isActiveTab, isReady, showRobot]);

  const onSolverWordsSelected = (guessWord: string, startingWord: string) => {
    dispatch(setShouldShowSelectSolverWordsOverlay(false));
    dispatch(setRobotStartingWord(startingWord));
    dispatch(setWOD(guessWord));
  };

  return (
    <section itemID="SolverComponent" className={styles.SolverDisplayWrapper}>
      <section ref={overlayRef} itemID="ActiveGameDisplay" className={styles.SolverDisplay}>
        <section itemID="WordleSolverRobot">
          <RobotSolver
            onRobotGuessWord={addRobotWord}
            shouldSolvePuzzle={shouldSolvePuzzle}
            isLost={isLost}
            isWon={isWon}
            onSubmitGuess={onSubmitRobotGuess}
          />
        </section>

        {dictionaryLoaded && (
          <section itemID="InteractiveRobotDisplay" className={styles.RobotDisplay}>
            <InteractiveRobot
              isInit={isSolverReady}
              // onRobotClicked={handleOnRobotClicked}
              showRobot={isSolverReady && showRobot}
              showSelectSolverWordsOverlay={showSelectSolverWordsOverlay}
              onSelectSolverWordsCallback={(guessWord, startWord) => {
                console.log(...WordleSolverLog.logAction(`selected guess = ${guessWord} and starting ${startWord}`));
                onSolverWordsSelected(guessWord, startWord);
              }}
              showEndSolverGameOverlay={showEndSolverGameOverlay}
              onEndSolverGameCallback={() => {
                console.log(...WordleSolverLog.logAction(`on end game `));
                dispatch(resetWordleSolverGame());
              }}
              overlayBodyRef={overlayRef}
            />
          </section>
        )}

        <section itemID="guessRowsDisplay">
          <div className={styles.GuessRowsDisplayWrapper}>
            <div ref={guessRowTargetRef} className={styles.GuessRowsDisplay}>
              <RowGroup canSelectCells={false} />
            </div>
          </div>
        </section>

        <hr />
      </section>
    </section>
  );
};

export default WordleSolver;
