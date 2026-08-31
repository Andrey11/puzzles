import React from 'react';
import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';
import { Placement } from 'react-bootstrap/types';
import styles from './RobotOverlay.module.scss';

type RobotOverlayProps = {
  title: React.ReactNode;
  body: React.ReactNode;
  visible: boolean;
  rootClose: boolean;
  containerRef: HTMLElement;
  targetRef: HTMLElement;
  placement?: Placement | undefined;
  onClose?: () => void;
};

const RobotOverlay: React.FunctionComponent<RobotOverlayProps> = ({
  title,
  body,
  visible,
  containerRef,
  targetRef,
  placement = 'auto',
  rootClose = false,
  onClose,
}: RobotOverlayProps) => {
  return (
    <Overlay
      show={visible}
      flip={true}
      placement={placement}
      rootClose={rootClose}
      container={containerRef}
      containerPadding={20}
      target={targetRef}
      onHide={onClose}
      onExit={onClose}
    >
      <Popover className={`${styles.StatsInfoOverlay} ${styles.RobotOverlay}`} id="popover-contained">
        <Popover.Header as="h3">{title}</Popover.Header>
        <Popover.Body>{body}</Popover.Body>
      </Popover>
    </Overlay>
  );
};

export default RobotOverlay;
