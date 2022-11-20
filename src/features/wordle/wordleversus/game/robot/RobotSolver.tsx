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
  setRobotStatus,
} from './robotSolutionSlice';
import {
  isLostGame,
  isRobotGame,
  isWonGame,
  onSubmitGuess,
} from '../wordleVersusGameSlice';

const RobotSolverLog = getLogStyles({
  cmpName: 'RobotSolver',
  cmpNameCls: 'color: #2684ff; font-weight: bold;',
});

const ROBOT_SLEEP_TIME: number = 1000;
const ROBOT_PICK_WORD_TIME: number = 2000;

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
        console.log(...RobotSolverLog.logAction(`Starting first round`));
        dispatch(pickNextGuessWordAndStartSolvingPuzzle(dictionary));
      }, ROBOT_SLEEP_TIME);
      console.log(...RobotSolverLog.logData(`Sleeping ${ROBOT_SLEEP_TIME / 1000}s before starting first round`));
    } else if (robotStatus === 'calculate-robot-guess') {
      setTimeout(() => dispatch(pickNextGuessWordAndStartSolvingPuzzle(dictionary)), ROBOT_SLEEP_TIME);
      console.log(...RobotSolverLog.logData(`Sleeping ${ROBOT_SLEEP_TIME / 1000}s before starting next round`));
    } else if (robotStatus === 'submit-robot-guess') {
      setTimeout(() => dispatch(onSubmitGuess()), ROBOT_SLEEP_TIME);
      console.log(...RobotSolverLog.logData(`Sleeping for ${ROBOT_SLEEP_TIME / 1000}s before submitting guess`));
    } else if (robotStatus === 'analyze-robot-guess-result') {
      setTimeout(() => dispatch(analyzeGuessWordStatus(dictionary)), ROBOT_SLEEP_TIME);
      console.log(...RobotSolverLog.logData(`Sleeping for ${ROBOT_SLEEP_TIME / 1000}s before analysis`));
    }

  }, [dispatch, robotStatus, isRobotTurn, dictionary, isInit, isWon, isLost, shouldSolvePuzzle]);

  return <>Robot Is {robotStatus}</>;
};

export default RobotSolver;
