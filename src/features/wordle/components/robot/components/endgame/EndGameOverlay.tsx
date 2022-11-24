import React from 'react';
import Button from 'react-bootstrap/Button';
import Score from '../../../score/Score';


import styles from './EndGameOverlay.module.scss';

type EndGameOverlayProps = {
  winner: string;
  onEndMatchCallback: (playAgain: boolean) => void;
};

const EndGameOverlay: React.FC<EndGameOverlayProps> = ({
  winner,
  onEndMatchCallback,
}: EndGameOverlayProps) => {
  
  return (
    <div className={styles.EndGameComponent}>
      <h3>{`${winner} Wins!`}</h3>
      <Score />
      <p>Play Again?</p>
      <Button onClick={() => onEndMatchCallback(true)}>AGAIN</Button>
      <Button onClick={() => onEndMatchCallback(false)}>NOPE</Button>
    </div>
  );
};

export default EndGameOverlay;
