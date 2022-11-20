import React from 'react';
import Score from '../../../components/score/Score';

import styles from './EndGameSettings.module.scss';

type EndGameSettingsProps = {
  winner: string;
};

const EndGameSettings: React.FC<EndGameSettingsProps> = ({
  winner,
}: EndGameSettingsProps) => {
  
  return (
    <div className={styles.EndGameComponent}>
      <h3>{`${winner} Wins!`}</h3>
      <Score />
      <p>Play Again?</p>
    </div>
  );
};

export default EndGameSettings;
