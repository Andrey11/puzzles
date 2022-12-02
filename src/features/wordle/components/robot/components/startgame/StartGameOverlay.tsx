import React from 'react';
import { GearFill } from 'react-bootstrap-icons';
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

  const title: string = `Robot challenges you!`;
  const introText1: string = `Play one, three, or five games vs Robot in Wordle-like game.`;
  const introText2: string = `You can select the number of games in the settings menu.`;
  
  return (
    <div className={styles.StartGameComponent}>
      <h3>{title}</h3>
      <p>{introText1}</p>
      <p>{introText2}&nbsp;&nbsp;<GearFill /></p>
      <Button onClick={onStartMatchCallback}>START NEW MATCH</Button>
    </div>
  );
};

export default StartGameOverlay;