import React, { TouchEvent, useEffect, useMemo, useRef, useState } from 'react';
import Ratio from 'react-bootstrap/Ratio';
import { getLogStyles } from '../../PuzzleWordle-helpers';
import { useOverlay } from '../overlay/InfoOverlay';
import EndGameOverlay from './components/endgame/EndGameOverlay';
import SelectWordForRobot from './components/selectword/SelectWordForRobot';
import StartGameOverlay from './components/startgame/StartGameOverlay';

import styles from './InteractiveRobot.module.scss';
import { OAnimationCls, getDownCls, getUpCls, isAnimatedToVisible, isHidden, isVisible } from './RobotAnimations';

type TSwipeDirection = 'none' | 'up' | 'down' | 'show';

type IRobotProps = {
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
  ...props
}: IRobotProps) => {
  const swipePositionY = useRef(0);
  const isAnimatingRef = useRef(false);
  const bodyContainerRef = useRef(null);
  const targetRef = useRef(null);

  const [isInit, setIsInit] = useState<boolean>(false);
  const [animationCls, setAnimationCls] = useState<string>(OAnimationCls.HideRobot);
  const [swipeDir, setSwipeDir] = useState<TSwipeDirection>('none');

  /** MEMO OVERLAYS THAT AVIALBLE TO BE RENDERED */
  const overlayProps = useMemo(() => {
    let titleString: string = '';
    let bodyEl: JSX.Element = <></>;
    let trigger: JSX.Element = <></>;
    let canDismiss: boolean = showSelectWordOverlay || showStartMatchOverlay;

    if (showSelectWordOverlay) {
      titleString = 'Enter your guess';
      bodyEl = (
        <SelectWordForRobot
          onWordSelected={(word) => {
            setAnimationCls(OAnimationCls.LurkRobot);
            onSelectWordCallback(word);
          }}
        />
      );
    } else if (showEndMatchOverlay) {
      titleString = 'Match is over!';
      bodyEl = <EndGameOverlay onEndMatchCallback={(playAgain) => {
        if (playAgain) {
          setAnimationCls(OAnimationCls.LurkRobot);
        }
        onEndMatchCallback(playAgain)}} />;
    } else if (showStartMatchOverlay) {
      titleString = 'New Match';
      bodyEl = (
        <StartGameOverlay
          onStartMatchCallback={() => {
            setAnimationCls(OAnimationCls.LurkRobot);
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
  });

  /** OVRLAY VISIBILITY CONTROL, ACCOUNTS FOR ANIMATION DURATION */
  useEffect(() => {
    if (!isInit) {
      setIsInit(true);
      return;
    }

    if (shouldRenderOverlay) {
      console.log(...RobotLog.logData(`Should show overlay`));
      updateRobotPosition('show');
    }
  }, [isInit, shouldRenderOverlay]);

  /** ROBOT ANIMATION STATE CONTROLS */
  useEffect(() => {
    setAnimationCls(showRobot ? OAnimationCls.ShowRobot : OAnimationCls.HideRobot);
  }, [showRobot]);

  useEffect(() => {
    if (isAnimatingRef.current || overlayVisible || swipeDir === 'none') {
      const logString = `animating=${isAnimatingRef.current ? 'T' : 'F'}, overlay=${
        overlayVisible ? 'T' : 'F'
      }, swipeDir=${swipeDir}`;
      console.log(...RobotLog.logFail(`useEffect - ${logString}`));
      return;
    }

    if (swipeDir === 'down') {
      const downCls = getDownCls(animationCls);
      console.log(...RobotLog.logAction(`useEffect - animating down from ${animationCls} to ${downCls}`));
      isAnimatingRef.current = true;
      setOverlayVisible(false);
      setAnimationCls(downCls);
    } else if (swipeDir === 'show' || swipeDir === 'up') {
      if (isVisible(animationCls)) {
        console.log(...RobotLog.logAction(`useEffect - cls is ${animationCls}, overlay = ${shouldRenderOverlay}`));
        setOverlayVisible(shouldRenderOverlay);
        setSwipeDir('none');
      } else {
        const upCls = getUpCls(animationCls);
        console.log(...RobotLog.logAction(`useEffect - up cls ${upCls}`));
        isAnimatingRef.current = true;
        setOverlayVisible(false);
        setAnimationCls(upCls);
      }
    } else {
      console.log(...RobotLog.logAction(`useEffect - how did we get here?`));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overlayVisible, animationCls, swipeDir, setOverlayVisible, shouldRenderOverlay]);

  const onRobotHeadAnimationStart = () => {
    isAnimatingRef.current = true;
    console.log(...RobotLog.logAction(`Animation start - ${animationCls}`));
    setOverlayVisible(false);
  };

  const onRobotHeadAnimationEnd = () => {
    isAnimatingRef.current = false;
    if (isAnimatedToVisible(animationCls)) {
      const successStr = `setting ${animationCls} to ${OAnimationCls.VisibleRobot}`;
      console.log(...RobotLog.logSuccess(`Animation end - ${successStr}`));
      setAnimationCls(OAnimationCls.VisibleRobot);
    } else {
      console.log(...RobotLog.logSuccess(`Animation end - ${animationCls}`));
      setSwipeDir('none');
    }
  };

  const onRobotTouchStart = (touchEvent: TouchEvent<HTMLDivElement>) => {
    const startY = touchEvent.changedTouches.item(0).clientY;
    swipePositionY.current = startY;
  };

  const onRobotTouchEnd = (touchEvent: TouchEvent<HTMLDivElement>) => {
    const endY: number = touchEvent.changedTouches.item(0).clientY;
    if (!showRobot) {
      console.log(...RobotLog.logFail(`TouchEnd - Robot hidden via Redux`));
      return;
    }

    let animateDir: TSwipeDirection = 'none';
    let eventType: string = 'Swipe';

    // handle swipe actions
    if (endY !== swipePositionY.current) {
      animateDir = endY < swipePositionY.current ? 'up' : 'down';
    } else {
      // handle click action
      animateDir = isHidden(animationCls) ? 'up' : 'down';
      eventType = 'Click';
    }
    console.log(...RobotLog.logData(`TouchEnd | type = ${eventType} | animating = ${animateDir}`));
    updateRobotPosition(animateDir);
  };

  const updateRobotPosition = (direction: TSwipeDirection) => {
    if (!isAnimatingRef.current) {
      setSwipeDir(direction);
    }
  };

  return (
    <div ref={bodyContainerRef} className={`${styles.InteractiveRobotDisplay} ${animationCls} ${props.className || ''}`}>
      <div
        itemID="PoofAnimation"
        ref={targetRef}
        className={styles.RobotPoof}
      >
        <Ratio aspectRatio="1x1">
          <embed type="image/svg+xml" src="/images/poof.svg" />
        </Ratio>
      </div>

      <div
        itemID="RobotHead"
        className={styles.RobotImage}
        onAnimationStart={onRobotHeadAnimationStart}
        onAnimationEnd={onRobotHeadAnimationEnd}
      >
        <img
          src="/images/robot-head-filled.svg"
          width={100}
          height={100}
          alt="Robot Head"
          onTouchStart={onRobotTouchStart}
          onTouchEnd={onRobotTouchEnd}
        />

        <svg className={styles.RobotLeftEye} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <ellipse className={styles.RobotEye} fill="white" />
        </svg>
        <svg className={styles.RobotRightEye} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <ellipse className={styles.RobotEye} fill="white" />
        </svg>
      </div>

      <div className={styles.RobotCover}></div>

      {shouldRenderOverlay && InteractiveRobotOverlay}
    </div>
  );
};

export default InteractiveRobot;
