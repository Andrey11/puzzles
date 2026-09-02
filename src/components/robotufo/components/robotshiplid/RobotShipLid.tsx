import { UfoSpaceshipLidOpenCloseState, UfoSpaceshipLidOpenCloseStateT } from 'components/robotufo/RobotUfo.types';
import React from 'react';
import styles from './RobotShipLid.module.scss';

type RobotShipLidProps = {
  className?: string;
  openCloseLid?: UfoSpaceshipLidOpenCloseStateT;
};

const IMG_LID_SRC = '/images/robot-ufo/ufo-saucer-lid-70.webp';

const RobotShipLid: React.FC<RobotShipLidProps> = ({
  className = '',
  openCloseLid = UfoSpaceshipLidOpenCloseState.Close,
}) => {
  const baseCls = `${styles.RobotShipLidContainer} ${className}`;
  const openCloseLidCls = styles[`${openCloseLid}`];

  return (
    <span className={`${baseCls} ${openCloseLidCls}`}>
      <img src={IMG_LID_SRC} className={styles.RobotShipLidImage} />
    </span>
  );
};

export default RobotShipLid;
