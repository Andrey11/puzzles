import React, { useMemo } from 'react';
import { useAppSelector } from '../../../../app/hooks/hooks';
import { isUserGame } from '../../wordleversus/game/wordleVersusGameSlice';
import { IScoreModel } from '../../wordleversus/PuzzleWordleVersus.types';
import { getScore, isMatchFinished } from '../../wordleversus/wordleVersusSlice';

import styles from './Score.module.scss';

const Score: React.FC = () => {
  const score: IScoreModel = useAppSelector(getScore);
  const isUserTurn = useAppSelector(isUserGame);
  const matchFinished = useAppSelector(isMatchFinished);
  const turnHighlightCls = useMemo(() => {
    return matchFinished ? '' : isUserTurn ? styles.UserTurn : styles.RobotTurn;
  }, [isUserTurn, matchFinished]);
  const renderScoreElement = (label: string, score: number): JSX.Element => {
    return (
      <div className={styles.ScoreElement}>
        <div className={styles.ScoreLabel}>{label}</div>
        <div className={styles.ScoreValue}>{score}</div>
      </div>
    );
  };

  return (
    <div className={`${styles.ScoreDisplay} ${turnHighlightCls}`}>
      {renderScoreElement('You', score.userScore)}
      <div className={styles.ScoreColon}>:</div>
      {renderScoreElement('Robot', score.aiScore)}
    </div>
  );
};

export default Score;
