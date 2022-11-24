import React, { useMemo } from 'react';
import { useAppSelector } from 'app/hooks/hooks';
import { isUserGame } from '../../wordleversus/game/wordleVersusGameSlice';
import { IScoreModel } from '../../wordleversus/PuzzleWordleVersus.types';
import { Icon, Person, Robot} from 'react-bootstrap-icons';
import {
  getCurrentGame,
  getScore,
  isMatchFinished,
  isMatchStarted,
} from '../../wordleversus/wordleVersusSlice';

import styles from './Score.module.scss';

const Score: React.FC = () => {
  const score: IScoreModel = useAppSelector(getScore);
  const isUserTurn = useAppSelector(isUserGame);
  const matchFinished = useAppSelector(isMatchFinished);
  const matchStarted = useAppSelector(isMatchStarted);
  const currentGame = useAppSelector(getCurrentGame);
  const roundNumber =
    !matchFinished && matchStarted ? `Game ${currentGame}` : `---`;
  const turnHighlightCls = useMemo(() => {
    return matchFinished || !matchStarted
      ? ''
      : isUserTurn
      ? styles.UserTurn
      : styles.RobotTurn;
  }, [isUserTurn, matchFinished, matchStarted]);
  const renderScoreElement = (DisplayIcon: Icon, score: number): JSX.Element => {
    return (
      <div className={styles.ScoreElement}>
        <div className={styles.ScoreLabel}><DisplayIcon /></div>
        <div className={styles.ScoreValue}>{score.toFixed(1)}</div>
      </div>
    );
  };

  return (
    // <div className={styles.ScoreWrapper}>
    <>
      <div className={`${styles.ScoreDisplay} ${turnHighlightCls}`}>
        {renderScoreElement(Person, score.userScore)}
        {/* <div className={styles.ScoreColon}>:</div> */}
        <div className={`${styles.ScoreGameCounter} text-muted`}>{roundNumber}</div>
        {renderScoreElement(Robot, score.aiScore)}
      </div>
    </>
  );
};

export default Score;
