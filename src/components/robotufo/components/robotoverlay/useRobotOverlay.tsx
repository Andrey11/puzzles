// cSpell:enableCompoundWords
import RobotOverlay from 'components/robotufo/components/robotoverlay/RobotOverlay';
import { ReactNode, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Globe } from 'react-bootstrap-icons';
import { Placement } from 'react-bootstrap/types';
import styles from './RobotOverlay.module.scss';

export const RobotOverlayScreen = {
  None: 'None',
  Intro: 'Intro',
  SelectWord: 'SelectWord',
  Thinking: 'Thinking',
  Solved: 'Solved',
  Failed: 'Failed',
} as const;

export type RobotOverlayScreenT = (typeof RobotOverlayScreen)[keyof typeof RobotOverlayScreen];

export type RobotOverlayAction =
  | { type: 'select-starting-word' }
  | { type: 'start-solving' }
  | { type: 'try-again' }
  | { type: 'close' };

type UseRobotOverlayProps = {
  componentRef: any;
  targetRef: any;
  title?: ReactNode;
  body?: ReactNode;
  placement?: Placement | undefined;
  infoTrigger?: ReactNode;
  rootClose: boolean;
  visible?: boolean;
  onOverlayAction?: (action: RobotOverlayAction) => void;
};

// const msgBodyShort = 'Wordle Bot will attempt to solve your selected word';

const useRobotOverlay = (props: UseRobotOverlayProps) => {
  const hasShownIntroRef = useRef(false);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [overlayScreen, setOverlayScreen] = useState<RobotOverlayScreenT>(RobotOverlayScreen.Intro);

  const showOverlayByScreenType = (screen: RobotOverlayScreenT) => {
    if (screen === RobotOverlayScreen.None) {
      if (showOverlay && overlayScreen === RobotOverlayScreen.Intro) {
        hasShownIntroRef.current = true;
      }

      setShowOverlay(false);
    } else {
      setOverlayScreen(screen);
      setShowOverlay(true);
    }
  };

  const showRobotLeavingAnimation = () => {};

  const showNewRoundAnimation = () => {};

  const getIntroBody = () =>
    hasShownIntroRef.current ? (
      <>I love solving puzzles. Select a word for me to solve.</>
    ) : (
      <>
        Hi! I am the Puzzle Bot, and I love solving puzzles. Select a word for me to solve. You can even select the
        starting word if you like.
      </>
    );

  const closeOverlay = () => {
    if (overlayScreen === RobotOverlayScreen.Intro) {
      hasShownIntroRef.current = true;
    }

    setShowOverlay(false);
  };

  const robotOverlayContent = {
    [RobotOverlayScreen.Intro]: {
      title: "Let's solve the puzzle!",
      body: (
        <>
          Hi! I am the Puzzle Bot, and I love solving puzzles. Select a word for me to solve. You can even select the
          starting word if you like.
        </>
      ),
    },
    [RobotOverlayScreen.SelectWord]: {
      title: 'Select a Word',
      body: <>Choose a word for me to solve.</>,
    },
    [RobotOverlayScreen.Thinking]: {
      title: 'Thinking...',
      body: <>Give me a second.</>,
    },
    [RobotOverlayScreen.Solved]: {
      title: 'Solved!',
      body: (
        <div className={styles.OverlayBodyLayout}>
          <p>I got it. Do you want to try a harder one?</p>
          <div className={styles.OverlayBodyActionButtons}>
            <Button variant="secondary" size="sm" onClick={showRobotLeavingAnimation}>
              NEXT TIME
            </Button>
            <Button variant="primary" size="sm" onClick={showNewRoundAnimation}>
              OKAY
            </Button>
          </div>
        </div>
      ),
    },
    [RobotOverlayScreen.Failed]: {
      title: 'Hmm...',
      body: (
        <div className={styles.OverlayBodyLayout}>
          <p>That one got me. Can I try again, please?</p>
          <div className={styles.OverlayBodyActionButtons}>
            <Button variant="primary" size="sm" onClick={showNewRoundAnimation}>
              OKAY
            </Button>
            <Button variant="secondary" size="sm" onClick={showRobotLeavingAnimation}>
              NEXT TIME
            </Button>
          </div>
        </div>
      ),
    },
    [RobotOverlayScreen.None]: {
      title: '',
      body: <></>,
    },
  } satisfies Record<RobotOverlayScreenT, { title: ReactNode; body: ReactNode }>;

  const overlayContent = robotOverlayContent[overlayScreen];
  const overlayBody = overlayScreen === RobotOverlayScreen.Intro ? getIntroBody() : overlayContent.body;

  const RobotOverlayComponent = (
    <>
      <div className={styles.InfoTrigger} onClick={() => setShowOverlay(!showOverlay)}>
        {props.infoTrigger ? props.infoTrigger : <Globe size={20} />}
      </div>
      <RobotOverlay
        title={props.title ?? overlayContent.title}
        body={props.body ?? overlayBody}
        visible={showOverlay && props.visible !== false}
        rootClose={props.rootClose}
        placement={props.placement}
        containerRef={props.componentRef.current}
        targetRef={props.targetRef.current}
        onClose={closeOverlay}
      />
    </>
  );

  return {
    OverlayComponent: RobotOverlayComponent,
    overlayVisible: showOverlay,
    overlayScreen,
    setOverlayVisible: setShowOverlay,
    showOverlayByScreenType,
  };
};

export default useRobotOverlay;
