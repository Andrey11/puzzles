import { HeadVisibilityT, MouthState, MouthStateT } from 'components/robotufo/RobotUfo.types';
import React from 'react';
import styles from './RobotHead.module.scss';

type RobotHeadProps = {
  className?: string;
  visibilityState?: HeadVisibilityT;
  mouthState?: MouthStateT;
};

const mouthPathByState: Record<MouthStateT, string> = {
  [MouthState.Neutral]: 'M 38 66 Q 50 66 62 66',
  [MouthState.Smiling]: 'M 36 64 Q 50 74 64 64',
  [MouthState.Frown]: 'M 36 68 Q 50 58 64 68',
  [MouthState.Talking]: 'M 36 64 Q 50 74 64 64',
  [MouthState.Surprised]: 'M 50 58 C 57 58 61 63 61 69 C 61 76 57 80 50 80 C 43 80 39 76 39 69 C 39 63 43 58 50 58 Z',
};

const RobotHead: React.FC<RobotHeadProps> = ({
  className = '',
  visibilityState = 'Hidden',
  mouthState = MouthState.Neutral,
}) => {
  const baseCls = `${styles.RobotHeadContainer} ${className}`;
  const headVisibilityCls = styles[`RobotHead${visibilityState}`] ?? styles.RobotHeadHidden;
  const mouthStateCls = styles[`Mouth${mouthState}`] ?? styles.MouthNeutral;
  const mouthPath = mouthPathByState[mouthState] ?? mouthPathByState[MouthState.Neutral];
  const surprisedEyesCls = mouthState === MouthState.Surprised ? styles.SurprisedEyes : '';
  const eyeBallScanningCls = visibilityState === 'Peeking' ? styles.Scanning : '';

  return (
    <div className={`${baseCls} ${styles.RobotHead} ${headVisibilityCls}`}>
      <span className={styles.RobotHeadWrapper}>
        <img src="/images/robot-ufo/robot-head.webp" width={90} height={74} alt="Robot Head" />
      </span>
      <span className={`${styles.RobotEyesWrapper} ${styles.Blink} ${surprisedEyesCls}`}>
        <span className={styles.RobotEyeLeft}>
          <span className={`${styles.RobotEyeBall} ${eyeBallScanningCls}`}></span>
        </span>
        <span className={styles.RobotEyeRight}>
          <span className={`${styles.RobotEyeBall} ${eyeBallScanningCls}`}></span>
        </span>
      </span>
      <span className={styles.RobotMouthWrapper}>
        <svg className={styles.RobotMouthContainer} viewBox="0 0 100 100" aria-hidden="true">
          <g className={`${styles.RobotMouthGroup}`}>
            <path className={`${styles.RobotMouth} ${mouthStateCls}`} d={mouthPath} />
          </g>
        </svg>
      </span>
    </div>
  );
};

export default RobotHead;
