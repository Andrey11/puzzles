import React, { useState } from 'react';
import Popover from 'react-bootstrap/Popover';
import Overlay from 'react-bootstrap/Overlay';

import { InfoCircle } from 'react-bootstrap-icons';

import styles from './InfoOverlay.module.scss';
import { Placement } from 'react-bootstrap/types';

type InfoOverlayProps = {
  title: React.ReactNode;
  body: React.ReactNode;
  visible: boolean;
  rootClose: boolean;
  containerRef: HTMLElement;
  targetRef: HTMLElement;
  placement?: Placement | undefined;
  onClose?: () => void;
};

const InfoOverlay: React.FunctionComponent<InfoOverlayProps> = ({ 
  title, 
  body,
  visible,
  containerRef,
  targetRef,
  placement = 'auto',
  rootClose = false,
  onClose, 
}: InfoOverlayProps) => {

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
        <Popover.Body>
          {body}
        </Popover.Body>
      </Popover>
    </Overlay>
  );
};


type OverlayProps = {
  componentRef: any, 
  targetRef: any,
  title?: React.ReactNode,
  body?: React.ReactNode,
  placement?: Placement | undefined,
  infoTrigger?: React.ReactNode,
  rootClose: boolean,
}

const useOverlay = (props: OverlayProps) => {

  const [showOverlay, setShowOverlay] = useState<boolean>(false);

  const OverlayComponent = (
    <>
      <div className={styles.InfoTrigger} onClick={() => setShowOverlay(!showOverlay)}>
      {props.infoTrigger ? props.infoTrigger : <InfoCircle size={20}/>}
      </div>
      <InfoOverlay
        title={props.title ? props.title : 'Enter a word from wordle dictionary' }
        body={props.body ? props.body : 'Wordle Bot will attempt to solve your selected word'} 
        visible={showOverlay}
        rootClose={props.rootClose}
        placement={props.placement} 
        containerRef={props.componentRef.current} 
        targetRef={props.targetRef}
        onClose={() => setShowOverlay(false)} 
      />
    </>
  );

  return { OverlayComponent, overlayVisible: showOverlay, setOverlayVisible: setShowOverlay };
};

export {InfoOverlay as default, useOverlay};
