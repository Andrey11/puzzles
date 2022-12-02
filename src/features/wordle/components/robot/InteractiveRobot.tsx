import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Ratio from 'react-bootstrap/Ratio';
import { getLogStyles } from '../../PuzzleWordle-helpers';
import { useOverlay } from '../overlay/InfoOverlay';
import EndGameOverlay from './components/endgame/EndGameOverlay';
import RobotHead, { DisplayPosition } from './components/head/RobotHead';
import SelectWordForRobot from './components/selectword/SelectWordForRobot';
import StartGameOverlay from './components/startgame/StartGameOverlay';

import styles from './InteractiveRobot.module.scss';
// import { OAnimationCls, getDownCls, getUpCls, isAnimatedToVisible, isHidden, isVisible } from './RobotAnimations';
// import { RobotHeadSwipeDirection } from './RobotSolver.types';

type IRobotProps = {
  isInit: boolean;
  showRobot: boolean;
  showSelectWordOverlay?: boolean;
  showStartMatchOverlay?: boolean;
  showEndMatchOverlay?: boolean;
  onRobotClicked?: () => void;
  onSelectWordCallback?: (word: string) => void;
  onStartMatchCallback?: () => void;
  onEndMatchCallback?: (playAgain: boolean) => void;
  overlayBodyRef?: any;
} & React.HTMLAttributes<HTMLDivElement>;

const RobotLog = getLogStyles({
  cmpName: 'InteractiveRobot',
  cmpNameCls: 'color: #557CB3; font-weight: bold;',
});

const InteractiveRobot: React.FC<IRobotProps> = ({
  showRobot,
  showSelectWordOverlay = false,
  showStartMatchOverlay = false,
  showEndMatchOverlay = false,
  onRobotClicked = () => {},
  onStartMatchCallback = () => {},
  onSelectWordCallback = () => {},
  onEndMatchCallback = () => {},
  overlayBodyRef = document.body,
  isInit = false,
  ...props
}: IRobotProps) => {
  const bodyContainerRef = useRef(null);
  const targetRef = useRef(null);

  const [headDisplayPosition, setHeadDisplayPosition] = useState<DisplayPosition>('none');
  
  /** MEMO OVERLAYS THAT AVIALBLE TO BE RENDERED */
  const overlayProps = useMemo(() => {
    let titleString: string = '';
    let bodyEl: JSX.Element = <></>;
    let trigger: JSX.Element = <></>;
    let canDismiss: boolean = showSelectWordOverlay || showStartMatchOverlay;
    let visible: boolean = false;

    if (showSelectWordOverlay) {
      titleString = 'Enter your guess';
      visible = true;
      bodyEl = (
        <SelectWordForRobot
          onWordSelected={(word) => {
            setHeadDisplayPosition('halfWay');
            onSelectWordCallback(word);
          }}
        />
      );
    } else if (showEndMatchOverlay) {
      titleString = 'Match is over!';
      visible = true;
      bodyEl = (
        <EndGameOverlay
          onEndMatchCallback={(playAgain) => {
            if (playAgain) {
              setHeadDisplayPosition('halfWay');
            }
            onEndMatchCallback(playAgain);
          }}
        />
      );
    } else if (showStartMatchOverlay) {
      titleString = 'New Match';
      visible = true;
      bodyEl = (
        <StartGameOverlay
          onStartMatchCallback={() => {
            setHeadDisplayPosition('halfWay');
            onStartMatchCallback();
          }}
          newSession={false}
        />
      );
    }

    return {
      title: titleString,
      bodyEl: bodyEl,
      trigger: trigger,
      rootClose: canDismiss,
      visible: visible,
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
    return showSelectWordOverlay || showStartMatchOverlay || showEndMatchOverlay;
  }, [showEndMatchOverlay, showSelectWordOverlay, showStartMatchOverlay]);

  /** SINGLE OVRLAY COMPONENT WITH DYNAMIC INNER PROPS */
  const {
    OverlayComponent: InteractiveRobotOverlay,
    setOverlayVisible,
    overlayVisible,
  } = useOverlay({
    componentRef: overlayBodyRef,
    targetRef: targetRef,
    placement: 'top',
    title: overlayProps.title,
    body: overlayProps.bodyEl,
    infoTrigger: overlayProps.trigger,
    rootClose: overlayProps.rootClose,
    visible: overlayProps.visible,
  });

  /** OVRLAY VISIBILITY CONTROL */
  useEffect(() => {
    if (!isInit) return;

    if (shouldRenderOverlay && showRobot) {
      console.log(...RobotLog.logData(`Should show overlay`));
      if (headDisplayPosition === 'fullyUp') {
        setOverlayVisible(true);
      } else {
        setHeadDisplayPosition('fullyUp');
      }
    } else {
      setOverlayVisible(false);
    }
  // we don't want to listen for headDisplayPosition changes in this hook
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInit, setOverlayVisible, shouldRenderOverlay, showRobot]);

  const onHeadSwipeDown = useCallback(() => {
    if (!overlayVisible) {
      if (headDisplayPosition === 'fullyUp') {
        setHeadDisplayPosition('halfWay');
      } else if (headDisplayPosition === 'halfWay') {
        setHeadDisplayPosition('onlyAntenaUp');
      } else if (headDisplayPosition === 'onlyAntenaUp') {
        setHeadDisplayPosition('hidden');
      }
    }
  }, [headDisplayPosition, overlayVisible]);

  const onHeadSwipeUp = () => {
    if (headDisplayPosition === 'hidden') {
      setHeadDisplayPosition('fullyUp');
    } else if (headDisplayPosition === 'halfWay') {
      setHeadDisplayPosition('fullyUp');
    } else if (headDisplayPosition === 'onlyAntenaUp') {
      setHeadDisplayPosition('halfWay');
    }
  };

  const onHeadAnimationEnd = (displayPos: DisplayPosition) => {
    if (shouldRenderOverlay && !overlayVisible && displayPos === 'fullyUp') {
      setOverlayVisible(true);
    }
  };

  return (
    <div ref={bodyContainerRef} className={`${styles.InteractiveRobotDisplay} ${props.className || ''}`}>
      <div itemID="PoofAnimation" ref={targetRef} className={styles.RobotPoof}>
        <Ratio aspectRatio="1x1">
          <embed type="image/svg+xml" src="/images/poof.svg" />
        </Ratio>
      </div>

      <RobotHead
        isInit={isInit}
        displayPosition={headDisplayPosition}
        onHeadClick={() => {
          console.log(...RobotLog.logAction(`clicked on robot head`));
        }}
        onHeadSwipeDown={onHeadSwipeDown}
        onHeadSwipeUp={onHeadSwipeUp}
        onHeadAnimationEnd={onHeadAnimationEnd}
      />

      <div className={styles.RobotCover}></div>

      {InteractiveRobotOverlay}
    </div>
  );
};

export default InteractiveRobot;
