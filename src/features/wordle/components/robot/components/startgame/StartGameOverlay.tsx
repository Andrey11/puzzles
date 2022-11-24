import React from 'react';
import Button from 'react-bootstrap/Button';

import styles from './StartGameOverlay.module.scss';

type StartGameOverlayProps = {
  newSession: boolean;
  onStartMatchCallback: () => void;
};

const StartGameOverlay: React.FC<StartGameOverlayProps> = ({
  newSession,
  onStartMatchCallback,
}: StartGameOverlayProps) => {
  
  return (
    <div className={styles.StartGameComponent}>
      <h3>{`Robot wants to challenge you!`}</h3>
      <p>Some text about new game</p>
      <Button onClick={onStartMatchCallback}>Start Match</Button>
    </div>
  );
};

export default StartGameOverlay;