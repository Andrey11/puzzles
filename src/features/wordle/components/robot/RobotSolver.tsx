import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'app/hooks/hooks';
import { getLogStyles, getRandomWord } from '../../PuzzleWordle-helpers';
import { getDictionary } from '../dictionary/wordleDictionarySlice';
import {
  robotPickedWod,
  shouldRobotPickWod,
} from '../../wordleversus/wordleVersusSlice';
import {
  analyzeGuessWordStatus,
  getRobotStatus,
  pickNextGuessWordAndStartSolvingPuzzle,
  setRobotStatus,
} from './robotSolutionSlice';
// import {
//   isLostGame,
//   isWonGame,
//   onSubmitGuess,
// } from '../../wordleversus/game/wordleVersusGameSlice';
import { OnRobotPickedWord, OnSubmitRobotWord } from './RobotSolver.types';

const RobotSolverLog = getLogStyles({
  cmpName: 'RobotSolver',
  cmpNameCls: 'color: #2684ff; font-weight: bold;',
});

const ROBOT_SLEEP_TIME: number = 1000;
const ROBOT_PICK_WORD_TIME: number = 2000;

type RobotSolverProps = {
  onRobotGuessWord: OnRobotPickedWord;
  shouldSolvePuzzle: boolean;
  isWon: boolean;
  isLost: boolean;
  onSubmitGuess: OnSubmitRobotWord
};

const RobotSolver: React.FC<RobotSolverProps> = ({
  onRobotGuessWord,
  shouldSolvePuzzle,
  isWon,
  isLost,
  onSubmitGuess,

}: RobotSolverProps) => {
  const [isInit, setIsInit] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const robotStatus = useAppSelector(getRobotStatus);
  const dictionary = useAppSelector(getDictionary);
  const shouldPickWod = useAppSelector(shouldRobotPickWod);
  

  useEffect(() => {
    if (!isInit) {
      setIsInit(true);
    }
  }, [isInit]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (!isInit) {
      return;
    }

    if (shouldPickWod) {
      dispatch(setRobotStatus('robot-picking-word'));
      timeoutId = setTimeout(() => {
        console.log(...RobotSolverLog.logAction(`Starting first round`));
        const word = getRandomWord();
        dispatch(robotPickedWod(word));
        dispatch(setRobotStatus('idle'));
      }, ROBOT_PICK_WORD_TIME);
    }

    return () => clearTimeout(timeoutId);
  }, [dispatch, isInit, shouldPickWod]);

  useEffect(() => {
    if (isWon || isLost) {
      return;
    }

    if (!shouldSolvePuzzle) {
      return;
    }

    if (robotStatus === 'idle') {
      setTimeout(() => {
        // console.log(...RobotSolverLog.logAction(`Starting first round`));
        dispatch(
          pickNextGuessWordAndStartSolvingPuzzle(dictionary, onRobotGuessWord)
        );
      }, ROBOT_SLEEP_TIME);
      // console.log(
      //   ...RobotSolverLog.logData(
      //     `Sleeping ${ROBOT_SLEEP_TIME / 1000}s before starting first round`
      //   )
      // );
    } else if (robotStatus === 'calculate-robot-guess') {
      setTimeout(
        () => dispatch(pickNextGuessWordAndStartSolvingPuzzle(dictionary, onRobotGuessWord)),
        ROBOT_SLEEP_TIME
      );
      // console.log(
      //   ...RobotSolverLog.logData(
      //     `Sleeping ${ROBOT_SLEEP_TIME / 1000}s before starting next round`
      //   )
      // );
    } else if (robotStatus === 'submit-robot-guess') {
      setTimeout(() => dispatch(onSubmitGuess()), ROBOT_SLEEP_TIME);
      // console.log(
      //   ...RobotSolverLog.logData(
      //     `Sleeping for ${ROBOT_SLEEP_TIME / 1000}s before submitting guess`
      //   )
      // );
    } else if (robotStatus === 'analyze-robot-guess-result') {
      setTimeout(
        () => dispatch(analyzeGuessWordStatus(dictionary)),
        ROBOT_SLEEP_TIME
      );
      // console.log(
      //   ...RobotSolverLog.logData(
      //     `Sleeping for ${ROBOT_SLEEP_TIME / 1000}s before analysis`
      //   )
      // );
    }
  }, [dispatch, robotStatus, dictionary, isInit, isWon, isLost, shouldSolvePuzzle, onRobotGuessWord, onSubmitGuess]);

  return <>Robot Is {robotStatus}</>;
};

export default RobotSolver;
