// cSpell:enableCompoundWords
import RobotHead from 'components/robotufo/components/robothead/RobotHead';
import useRobotOverlay, {
  RobotOverlayAction,
  RobotOverlayScreen,
  RobotOverlayScreenT,
} from 'components/robotufo/components/robotoverlay/useRobotOverlay';
import RobotShip from 'components/robotufo/components/robotship/RobotShip';
import RobotShipLid from 'components/robotufo/components/robotshiplid/RobotShipLid';
import {
  HeadVisibilityT,
  MouthStateT,
  UfoMovementStateT,
  UfoSpaceshipLidOpenCloseStateT,
} from 'components/robotufo/RobotUfo.types';
import { FC, JSX, useEffect, useRef } from 'react';
import { Globe } from 'react-bootstrap-icons';
import styles from './RobotUfoImage.module.scss';

type RobotUfoImageProps = {
  className?: string;
  ufoMovementState: UfoMovementStateT;
  lidState: UfoSpaceshipLidOpenCloseStateT;
  headVisibilityState: HeadVisibilityT;
  mouthState: MouthStateT;
  showOverlay?: RobotOverlayScreenT;
  onOverlayAction?: (action: RobotOverlayAction) => void;
};

const RobotUfoImage: FC<RobotUfoImageProps> = ({
  className = '',
  ufoMovementState,
  lidState,
  headVisibilityState,
  mouthState,
  showOverlay = RobotOverlayScreen.None,
  onOverlayAction = () => undefined,
}: RobotUfoImageProps): JSX.Element => {
  const baseCls = `${styles.RobotUfoImageContainer} ${className}`;

  const targetRef = useRef<HTMLDivElement>(null);

  const flyingShipCls = styles[`${ufoMovementState}`];

  const { OverlayComponent: RobotInfoTip, showOverlayByScreenType } = useRobotOverlay({
    componentRef: targetRef,
    targetRef: targetRef,
    infoTrigger: <Globe size={24} className={styles.RobotInfoTriggerIcon} />,
    rootClose: true,
    onOverlayAction,
  });

  useEffect(() => {
    showOverlayByScreenType(showOverlay);
  }, [showOverlay]);

  return (
    <div ref={targetRef} className={`${baseCls} ${flyingShipCls}`}>
      <div className={`${styles.SaucerUfo} ${styles.Hover}`}>
        {RobotInfoTip}
        <RobotHead visibilityState={headVisibilityState} mouthState={mouthState} />
        <RobotShipLid className={styles.SaucerLidContainer} openCloseLid={lidState} />
        <RobotShip className={styles.SaucerBodyContainer} />
      </div>
    </div>
  );
};

export default RobotUfoImage;
