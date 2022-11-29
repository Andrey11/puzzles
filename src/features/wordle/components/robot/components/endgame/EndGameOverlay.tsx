import { useAppSelector } from 'app/hooks/hooks';
import { getWinnerText } from 'features/wordle/wordleversus/wordleVersusSlice';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Score from '../../../score/Score';


import styles from './EndGameOverlay.module.scss';

type EndGameOverlayProps = {
  onEndMatchCallback: (playAgain: boolean) => void;
};

const EndGameOverlay: React.FC<EndGameOverlayProps> = ({
  onEndMatchCallback,
}: EndGameOverlayProps) => {
  
  const result: string = useAppSelector(getWinnerText);

  return (
    <div className={styles.EndGameComponent}>
      <h3>{result}</h3>
      <Score />
      <p>Play Again?</p>
      <Button onClick={() => onEndMatchCallback(true)}>AGAIN</Button>
      <Button onClick={() => onEndMatchCallback(false)}>NOPE</Button>
    </div>
  );
};

export default EndGameOverlay;
