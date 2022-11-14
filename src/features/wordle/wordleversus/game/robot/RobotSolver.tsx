import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../app/hooks/hooks';
import { getLogStyles, getRandomWord } from '../../../PuzzleWordle-helpers';
import { getDictionary } from '../../../components/dictionary/wordleDictionarySlice';
import {
  robotPickedWod,
  shouldRobotPickWod,
  shouldRobotSolvePuzzle,
} from '../../wordleVersusSlice';
import {
  analyzeGuessWordStatus,
  getRobotStatus,
  pickNextGuessWordAndStartSolvingPuzzle,
} from './robotSolutionSlice';
import {
  isLostGame,
  isRobotGame,
  isWonGame,
  onSubmitGuess,
} from '../wordleVersusGameSlice';

const RobotSolverLog = getLogStyles({
  cmpName: 'PuzzleWordleVersus',
  cmpNameCls: 'color: #fd8008; font-weight: bold;',
});

const RobotSolver: React.FC = () => {
  const [isInit, setIsInit] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const robotStatus = useAppSelector(getRobotStatus);
  const dictionary = useAppSelector(getDictionary);
  const shouldPickWod = useAppSelector(shouldRobotPickWod);
  const shouldSolvePuzzle = useAppSelector(shouldRobotSolvePuzzle);
  const isRobotTurn = useAppSelector(isRobotGame);
  const isWon = useAppSelector(isWonGame);
  const isLost = useAppSelector(isLostGame);

  useEffect(() => {
    if (!isInit) {
      setIsInit(true);
    }
  }, [isInit]);

  useEffect(() => {
    if (!isInit) {
      return;
    }

    if (shouldPickWod) {
      const word = getRandomWord();
      dispatch(robotPickedWod(word));
    }
  }, [dispatch, isInit, shouldPickWod]);

  useEffect(() => {
    if (!isInit || !isRobotTurn) {
      return;
    }

    if (isWon || isLost) {
      return;
    }

    if (!shouldSolvePuzzle) {
      return;
    }

    if (robotStatus === 'idle') {
      setTimeout(() => {
        dispatch(pickNextGuessWordAndStartSolvingPuzzle(dictionary));
        console.log(...RobotSolverLog.logData('Starting first round'));
      }, 1000);
      console.log(...RobotSolverLog.logData('Sleeping 1s before starting first round'));
    } else if (robotStatus === 'calculate-robot-guess') {
      setTimeout(() => dispatch(pickNextGuessWordAndStartSolvingPuzzle(dictionary)), 1000);
      console.log(...RobotSolverLog.logData('Sleeping 1s before starting next round'));
    } else if (robotStatus === 'submit-robot-guess') {
      setTimeout(() => dispatch(onSubmitGuess()), 2000);
      console.log(...RobotSolverLog.logData('Sleeping for 2s before submitting guess'));
    } else if (robotStatus === 'analyze-robot-guess-result') {
      setTimeout(() => dispatch(analyzeGuessWordStatus(dictionary)), 1000);
      console.log(...RobotSolverLog.logData('Sleeping for 1s before analysis'));
    }

  }, [dispatch, robotStatus, isRobotTurn, dictionary, isInit, isWon, isLost, shouldSolvePuzzle]);

  return <>Robot Is {robotStatus}</>;
};

export default RobotSolver;
