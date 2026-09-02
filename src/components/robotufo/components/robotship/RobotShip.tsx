import React from 'react';
import styles from './RobotShip.module.scss';

type RobotShipProps = {
  className?: string;
};

const RobotShip: React.FC<RobotShipProps> = ({ className = '' }) => {
  const baseCls = `${styles.RobotShipContainer} ${className}`;
  return (
    <span className={baseCls}>
      <img src="/images/robot-ufo/ufo-saucer.webp" className={styles.RobotShipImage} />
    </span>
  );
};

export default RobotShip;
