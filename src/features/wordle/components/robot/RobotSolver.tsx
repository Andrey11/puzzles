import { useAppDispatch, useAppSelector } from 'app/hooks/hooks';
import { getLogStyles, getRandomWord } from 'features/wordle/PuzzleWordle-helpers';
import { robotPickedWod, shouldRobotPickWod } from 'features/wordle/wordleversus/wordleVersusSlice';
import React, { useEffect, useState } from 'react';
import { getDictionary } from '../dictionary/wordleDictionarySlice';
import {
  analyzeGuessWordStatus,
  getRobotStatus,
  pickNextGuessWordAndStartSolvingPuzzle,
  setRobotStatus,
} from './robotSolutionSlice';
import { OnRobotPickedWord, OnSubmitRobotWord } from './RobotSolver.types';

const RobotSolverLog = getLogStyles({
  cmpName: 'RobotSolver',
  cmpNameCls: 'color: #2684ff; font-weight: bold;',
});

const ROBOT_SLEEP_TIME: number = 1000;
const ROBOT_PICK_WORD_TIME: number = 2000;

type RobotSolverProps = {
  isLost: boolean;
  isWon: boolean;
  shouldSolvePuzzle: boolean;
  firstGuessWord?: string;
  onRobotGuessWord: OnRobotPickedWord;
  onSubmitGuess: OnSubmitRobotWord;
};

const RobotSolver: React.FC<RobotSolverProps> = ({
  isLost,
  isWon,
  shouldSolvePuzzle,
  firstGuessWord,
  onRobotGuessWord,
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
        const word = firstGuessWord ?? getRandomWord();
        dispatch(robotPickedWod(word));
        dispatch(setRobotStatus('idle'));
      }, ROBOT_PICK_WORD_TIME);
    }

    return () => clearTimeout(timeoutId);
  }, [dispatch, firstGuessWord, isInit, shouldPickWod]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isWon || isLost) {
      return;
    }

    if (!shouldSolvePuzzle) {
      return;
    }

    if (robotStatus === 'idle') {
      timeoutId = setTimeout(() => {
        // console.log(...RobotSolverLog.logAction(`Starting first round`));
        dispatch(pickNextGuessWordAndStartSolvingPuzzle(dictionary, onRobotGuessWord, firstGuessWord));
      }, ROBOT_SLEEP_TIME);
      // console.log(
      //   ...RobotSolverLog.logData(
      //     `Sleeping ${ROBOT_SLEEP_TIME / 1000}s before starting first round`
      //   )
      // );
    } else if (robotStatus === 'calculate-robot-guess') {
      timeoutId = setTimeout(
        () => dispatch(pickNextGuessWordAndStartSolvingPuzzle(dictionary, onRobotGuessWord)),
        ROBOT_SLEEP_TIME
      );
      // console.log(
      //   ...RobotSolverLog.logData(
      //     `Sleeping ${ROBOT_SLEEP_TIME / 1000}s before starting next round`
      //   )
      // );
    } else if (robotStatus === 'submit-robot-guess') {
      timeoutId = setTimeout(() => dispatch(onSubmitGuess()), ROBOT_SLEEP_TIME);
      // console.log(
      //   ...RobotSolverLog.logData(
      //     `Sleeping for ${ROBOT_SLEEP_TIME / 1000}s before submitting guess`
      //   )
      // );
    } else if (robotStatus === 'analyze-robot-guess-result') {
      timeoutId = setTimeout(() => dispatch(analyzeGuessWordStatus(dictionary)), ROBOT_SLEEP_TIME);
      // console.log(
      //   ...RobotSolverLog.logData(
      //     `Sleeping for ${ROBOT_SLEEP_TIME / 1000}s before analysis`
      //   )
      // );
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [
    dispatch,
    robotStatus,
    dictionary,
    isInit,
    isWon,
    isLost,
    shouldSolvePuzzle,
    firstGuessWord,
    onRobotGuessWord,
    onSubmitGuess,
  ]);

  return <span>Robot Is {robotStatus}</span>;
};

export default RobotSolver;
