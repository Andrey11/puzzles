import React, { PointerEvent, TouchEvent, useRef, useState, useEffect } from 'react';

import useDeviceDetect from 'app/hooks/useDeviceDetect';
import { getLogStyles } from 'features/wordle/PuzzleWordle-helpers';
// import { isAnimatedToVisible, OAnimationCls } from '../../RobotAnimations';
import { RobotHeadSwipeDirection } from '../../RobotSolver.types';

import styles from './RobotHead.module.scss';
import { isAnimatedToVisible, OAnimationCls } from '../../RobotAnimations';

type EyesVariant = 'open' | 'closed' | 'squint' | 'happy' | 'sad' | 'none';
export type DisplayPosition = 'hidden' | 'onlyAntenaUp' | 'halfWay' | 'fullyUp' | 'none';
type EmotionVariant = 'none' | 'sad' | 'happy' | 'thinking' | 'neutral';

type RobotHeadProps = {
  onHeadClick?: () => void;
  onHeadSwipeDown?: () => void;
  onHeadSwipeUp?: () => void;
  onHeadAnimationEnd?: (displayPosition: DisplayPosition) => void;
  eyesVariant?: EyesVariant;
  emotionVariant?: EmotionVariant;
  displayPosition?: DisplayPosition;
  isInit?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

const HeadLog = getLogStyles({
  cmpName: 'RobotHead',
  cmpNameCls: 'color: #33708e; font-weight: bold;',
});

const RobotHead: React.FC<RobotHeadProps> = ({
  onHeadClick = () => {},
  onHeadSwipeDown = () => {},
  onHeadSwipeUp = () => {},
  onHeadAnimationEnd = () => {},
  eyesVariant = 'open',
  emotionVariant = 'none',
  displayPosition = 'hidden',
  isInit = false,
  ...props
}: RobotHeadProps) => {
  const swipeStartY = useRef(0);
  const isAnimatingRef = useRef(false);
  const animationQueue = useRef<Array<DisplayPosition>>([]);
  const lastAnimationRef = useRef<DisplayPosition>('hidden');

  const [animationCls, setAnimationCls] = useState<string>('');
  const [robotInitCls, setRobotInitCls] = useState<string>('robot--init');

  const { isMobile } = useDeviceDetect();

  useEffect(() => {
    if (!isInit) return;

    animationQueue.current.push(displayPosition);
    console.log(...HeadLog.logAction(`useEffect - ${animationQueue.current}`));
    setRobotInitCls('');
    doAnimation();
  }, [isInit, displayPosition]);

  const onRobotHeadAnimationStart = () => {
    if (animationCls) {
      isAnimatingRef.current = true;
      console.log(...HeadLog.logAction(`Animation started - ${animationCls}`));
    }
  };

  const onRobotHeadAnimationEnd = () => {
    isAnimatingRef.current = false;
    const displayPos: DisplayPosition = animationQueue.current.shift() || 'none';
    lastAnimationRef.current = displayPos;
    console.log(...HeadLog.logSuccess(`Animation end - ${animationCls}`));
    onHeadAnimationEnd(displayPos);

    if (isAnimatedToVisible(animationCls)) {
      const successStr = `setting ${animationCls} to ${OAnimationCls.VisibleRobot}`;
      console.log(...HeadLog.logSuccess(`Animation end - ${successStr}`));
      setAnimationCls(OAnimationCls.VisibleRobot);
    }

    doAnimation();
  };

  const onRobotTouchStart = (touchEvent: TouchEvent<HTMLDivElement>) => {
    swipeStartY.current = touchEvent.changedTouches.item(0).clientY;
  };
  const onRobotPointerDown = (pointerEvent: PointerEvent<HTMLDivElement>) => {
    if (!isMobile) {
      swipeStartY.current = pointerEvent.clientY;
    }
  };
  const onRobotTouchEnd = (touchEvent: TouchEvent<HTMLDivElement>) => {
    const endY: number = touchEvent.changedTouches.item(0).clientY;
    let swipeDir: RobotHeadSwipeDirection = 'none';

    // handle swipe actions
    if (endY !== swipeStartY.current) {
      swipeDir = endY < swipeStartY.current ? 'up' : 'down';
      console.log(...HeadLog.logData(`TouchEnd | swipe direction = ${swipeDir}`));
      updateRobotPosition(swipeDir);
    } else if (isMobile) {
      // handle click action
      onHeadClick();
    }
  };
  const onRobotPointerUp = (pointerEvent: PointerEvent<HTMLDivElement>) => {
    if (!isMobile) {
      const endY: number = pointerEvent.clientY;
      // handle swipe actions
      if (endY !== swipeStartY.current) {
        const swipeDir = endY < swipeStartY.current ? 'up' : 'down';
        console.log(...HeadLog.logData(`DragEnd | swipe direction = ${swipeDir}`));
        updateRobotPosition(swipeDir);
      }
    }
  };
  const onRobotClick = () => {
    if (!isMobile) {
      onHeadClick();
    }
  };

  const updateRobotPosition = (direction: RobotHeadSwipeDirection) => {
    if (direction === 'up') {
      onHeadSwipeUp();
    } else if (direction === 'down') {
      onHeadSwipeDown();
    }
  };

  const doAnimation = () => {
    if (!isAnimatingRef.current && animationQueue.current.length > 0) {
      const displayPos: DisplayPosition = animationQueue.current[0];
      console.log(...HeadLog.logAction(`doAnimation - ${animationQueue.current}`));
      let animation = '';
      switch (displayPos) {
        case 'hidden':
          animation = 'robot--off';
          break;
        case 'onlyAntenaUp':
          animation = 'robot--antena';
          break;
        case 'halfWay':
          animation =
            lastAnimationRef.current === 'fullyUp' ? 'robot--fullOn robot--halfDown' : 'robot--fullOn robot--toHalf';
          break;
        case 'fullyUp':
          animation = lastAnimationRef.current === 'halfWay' ? 'robot--fullOn robot--halfUp' : 'robot--on';
          break;
        case 'none':
          animation = '';
          break;
        default:
          animation = 'robot--on';
      }

      if (animation !== '' && lastAnimationRef.current !== animation) {
        setAnimationCls(animation);
      } else {
        animationQueue.current.shift();
      }
    }
  };

  return (
    <div 
      itemID="RobotHeadWrapper" 
      className={`${styles.RobotHead} ${animationCls} ${robotInitCls} ${props.className || ''}`}>
      <div
        itemID="RobotHeadDisplay"
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
          onPointerDown={onRobotPointerDown}
          onPointerUp={onRobotPointerUp}
          draggable={false}
          // onDragStart={onRobotDragStart}
          // onDragEnd={onRobotDragEnd}
          onClick={onRobotClick}
        />

        <svg className={styles.RobotLeftEye} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <ellipse className={styles.RobotEye} fill="white" />
        </svg>
        <svg className={styles.RobotRightEye} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <ellipse className={styles.RobotEye} fill="white" />
        </svg>
      </div>
    </div>
  );
};

// const useRobotHead = () => {};

export default RobotHead;
