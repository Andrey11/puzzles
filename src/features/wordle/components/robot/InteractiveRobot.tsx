import React, { useEffect, useMemo, useRef, useState } from 'react';
import Ratio from 'react-bootstrap/Ratio';
import { getLogStyles } from '../../PuzzleWordle-helpers';
import { useOverlay } from '../overlay/InfoOverlay';
import EndGameOverlay from './components/endgame/EndGameOverlay';
import SelectWordForRobot from './components/selectword/SelectWordForRobot';
import StartGameOverlay from './components/startgame/StartGameOverlay';

import styles from './InteractiveRobot.module.scss';

type IRobotProps = {
  showRobot: boolean;
  showSelectWordOverlay: boolean;
  showStartMatchOverlay: boolean;
  showEndMatchOverlay: boolean;
  onRobotClicked: () => void;
  onSelectWordCallback: (word: string) => void;
  onStartMatchCallback: () => void;
  onEndMatchCallback: (playAgain: boolean) => void;
};

const RobotUILog = getLogStyles({
  cmpName: 'InteractiveRobot',
  cmpNameCls: 'color: #557CB3; font-weight: bold;',
});

const InteractiveRobot: React.FC<IRobotProps> = ({
  showRobot,
  showSelectWordOverlay,
  showStartMatchOverlay,
  showEndMatchOverlay,
  onRobotClicked,
  onStartMatchCallback,
  onSelectWordCallback,
  onEndMatchCallback,
}: IRobotProps) => {
  const bodyContainerRef = useRef(null);
  const targetRef = useRef(null);

  const [isInit, setIsInit] = useState<boolean>(false);
  const [canShowOverlay, setCanShowOverlay] = useState<boolean>(false);
  const [robotStatusCls, setRobotStatusCls] = useState<string>('robot--off');

  /** MEMO OVERLAYS THAT AVIALBLE TO BE RENDERED */
  const overlayProps = useMemo(() => {
    let titleString: string = '';
    let bodyEl: JSX.Element = <></>;
    let trigger: JSX.Element = <></>;

    if (showSelectWordOverlay) {
      titleString = 'Enter your guess';
      bodyEl = (
        <SelectWordForRobot
          onWordSelected={(word) => {
            onSelectWordCallback(word);
            setRobotStatusCls(`robot--fullOn robot--halfOn`);
          }}
        />
      );
    } else if (showEndMatchOverlay) {
      titleString = 'Match is over!';
      bodyEl = (
        <EndGameOverlay winner="User" onEndMatchCallback={onEndMatchCallback} />
      );
    } else if (showStartMatchOverlay) {
      titleString = 'New Match';
      bodyEl = (
        <StartGameOverlay
          onStartMatchCallback={() => {
            onStartMatchCallback();
            setRobotStatusCls(`robot--fullOn robot--halfOn`);
          }}
          newSession={false}
        />
      );
    }

    return {
      title: titleString,
      bodyEl: bodyEl,
      trigger: trigger,
    };
  }, [
    onEndMatchCallback,
    onSelectWordCallback,
    onStartMatchCallback,
    showEndMatchOverlay,
    showSelectWordOverlay,
    showStartMatchOverlay,
  ]);

  /** MEMO RETURNS TRUE IF AN OVERLAY SHOULD BE RENDERED */
  const shouldRenderOverlay = useMemo(() => {
    return (
      showSelectWordOverlay || showStartMatchOverlay || showEndMatchOverlay
    );
  }, [showEndMatchOverlay, showSelectWordOverlay, showStartMatchOverlay]);

  /** SINGLE OVRLAY COMPONENT WITH DYNAMIC INNER PROPS */
  const { OverlayComponent: InteractiveRobotOverlay, setOverlayVisible } =
    useOverlay({
      componentRef: bodyContainerRef,
      targetRef: targetRef,
      placement: 'top',
      title: overlayProps.title,
      body: overlayProps.bodyEl,
      infoTrigger: overlayProps.trigger,
    });

  /** OVRLAY VISIBILITY CONTROL, ACCOUNTS FOR ANIMATION DURATION */
  useEffect(() => {
    if (!isInit) {
      setIsInit(true);
      return;
    }

    if (shouldRenderOverlay) {
      console.log(
        ...RobotUILog.logData(
          `Should show overlay, but canShowOverlay is ${canShowOverlay}`
        )
      );
      if (canShowOverlay) {
        setRobotStatusCls('robot--fullOn');
      }
      setOverlayVisible(canShowOverlay);
    } else {
      setOverlayVisible(false);
    }
  }, [canShowOverlay, isInit, setOverlayVisible, shouldRenderOverlay]);

  /** ROBOT ANIMATION STATE CONTROLS */
  useEffect(() => {
    setRobotStatusCls(showRobot ? 'robot--on' : 'robot--off');
  }, [showRobot]);

  return (
    <div
      ref={bodyContainerRef}
      onClick={() => onRobotClicked()}
      className={`${styles.InteractiveRobotDisplay} ${robotStatusCls}`}
    >
      <div
        ref={targetRef}
        className={styles.RobotPoof}
        onAnimationEnd={() => {
          setCanShowOverlay(false);
        }}
      >
        <Ratio aspectRatio="1x1">
          <embed type="image/svg+xml" src="/images/poof.svg" />
        </Ratio>
      </div>
      <div
        className={styles.RobotImage}
        onAnimationEnd={() => {
          setCanShowOverlay(true);
          if (robotStatusCls === 'robot--on') {
            setRobotStatusCls('robot--fullOn');
          }
        }}
      >
        <Ratio aspectRatio="1x1">
          <embed type="image/svg+xml" src="/images/robot-head-filled.svg" />
        </Ratio>
        <svg className={styles.RobotLeftEye} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <ellipse className={styles.RobotEye} cx="10" cy="10" rx="10" ry="10" fill="white" />
        </svg>
        <svg className={styles.RobotRightEye} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <ellipse className={styles.RobotEye} cx="10" cy="10" rx="10" ry="10" fill="white" />
        </svg>
      </div>
      <div className={styles.RobotCover}></div>
      {shouldRenderOverlay && InteractiveRobotOverlay}
    </div>
  );
};

export default InteractiveRobot;
