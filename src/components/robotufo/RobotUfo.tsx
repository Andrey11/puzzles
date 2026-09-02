// cSpell:enableCompoundWords
import {
  RobotOverlayAction,
  RobotOverlayScreen,
  RobotOverlayScreenT,
} from 'components/robotufo/components/robotoverlay/useRobotOverlay';
import RobotUfoImage from 'components/robotufo/components/robotufoimage/RobotUfoImage';
import {
  HeadVisibility,
  HeadVisibilityT,
  MouthState,
  MouthStateT,
  UfoMovementState,
  UfoMovementStateT,
  UfoSpaceshipLidOpenCloseState,
  UfoSpaceshipLidOpenCloseStateT,
} from 'components/robotufo/RobotUfo.types';
import { RobotState, RobotStateT } from 'features/wordle/PuzzleWordle.types';
import { wait } from 'helpers/Time.helpers';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import styles from './RobotUfo.module.scss';

type RobotUfoProps = {
  className?: string;
  robotState?: RobotStateT;
};

const RobotUfo: React.FC<RobotUfoProps> = ({ className = '', robotState = RobotState.Enter }) => {
  const baseCls = `${styles.RobotUfoContainer} ${className}`;
  const [ufoState, setUfoState] = useState<UfoMovementStateT>(UfoMovementState.Idle);
  const [openCloseLidState, setOpenCloseLidState] = useState<UfoSpaceshipLidOpenCloseStateT>(
    UfoSpaceshipLidOpenCloseState.Close
  );
  const [mouthState, setMouthState] = useState<MouthStateT>(MouthState.Neutral);
  const [headVisibilityState, setHeadVisibilityState] = useState<HeadVisibilityT>(HeadVisibility.Hidden);
  const [showOverlay, setShowOverlay] = useState<RobotOverlayScreenT>(RobotOverlayScreen.None);

  const displayEnterPuzzle = async () => {
    setUfoState(UfoMovementState.Enter);
    await wait(1500);
    setHeadVisibilityState(HeadVisibility.Peeking);
    await wait(3500);
    setOpenCloseLidState(UfoSpaceshipLidOpenCloseState.Open);
    await wait(1000);
    setHeadVisibilityState(HeadVisibility.Visible);
    setMouthState(MouthState.Smiling);
    await wait(500);
    setShowOverlay(RobotOverlayScreen.Intro);
    setMouthState(MouthState.Talking);
    await wait(3000);
    setMouthState(MouthState.Neutral);
  };

  const displayExitPuzzle = async () => {
    setShowOverlay(RobotOverlayScreen.None);
    setMouthState(MouthState.Neutral);
    setHeadVisibilityState(HeadVisibility.Hidden);
    await wait(500);
    setOpenCloseLidState(UfoSpaceshipLidOpenCloseState.Close);
    await wait(500);
    setUfoState(UfoMovementState.Exit);
    await wait(1500);
  };

  const displayHappyWin = async () => {
    setMouthState(MouthState.Smiling);
    await wait(1000);
    setShowOverlay(RobotOverlayScreen.Solved);
    setMouthState(MouthState.Talking);
    await wait(2000);
    setMouthState(MouthState.Smiling);
  };

  const displaySurprisingLoss = async () => {
    setMouthState(MouthState.Surprised);
    await wait(1000);
    setShowOverlay(RobotOverlayScreen.Failed);
    setMouthState(MouthState.Talking);
    await wait(2000);
    setMouthState(MouthState.Frown);
  };

  useEffect(() => {
    switch (robotState) {
      case RobotState.Exit:
        displayExitPuzzle();
        break;
      case RobotState.Won:
        displayHappyWin();
        break;
      case RobotState.Lost:
        displaySurprisingLoss();
        break;
      case RobotState.Enter:
      default:
        displayEnterPuzzle();
        break;
    }
  }, [robotState]);

  const handleOverlayAction = (action: RobotOverlayAction) => {};

  return (
    <div className={baseCls}>
      <RobotUfoImage
        ufoMovementState={ufoState}
        lidState={openCloseLidState}
        headVisibilityState={headVisibilityState}
        mouthState={mouthState}
        showOverlay={showOverlay}
        onOverlayAction={handleOverlayAction}
      />
      {/* DEBUG CONTROLS */}
      <div className={styles.ActionButtons}>
        <div className={styles.SameTypeButtons}>
          {/* prettier-ignore */}
          <Button variant={ufoState === UfoMovementState.Exit ? 'primary' : 'info'} size="sm" onClick={() => setUfoState(UfoMovementState.Exit)}>EXIT UFO</Button>
          {/* prettier-ignore */}
          <Button variant={ufoState === UfoMovementState.Idle ? 'primary' : 'info'} size="sm" onClick={() => setUfoState(UfoMovementState.Idle)}>IDLE UFO</Button>
          {/* prettier-ignore */}
          <Button variant={ufoState === UfoMovementState.Enter ? 'primary' : 'info'} size="sm" onClick={() => setUfoState(UfoMovementState.Enter)}>ENTER UFO</Button>
        </div>
        <div className={styles.SameTypeButtons}>
          {/* prettier-ignore */}
          <Button variant={openCloseLidState === UfoSpaceshipLidOpenCloseState.Close ? 'primary' : 'info'} size="sm" onClick={() => setOpenCloseLidState(UfoSpaceshipLidOpenCloseState.Close)}>CLOSE LID</Button>
          {/* prettier-ignore */}
          <Button variant={openCloseLidState === UfoSpaceshipLidOpenCloseState.Open ? 'primary' : 'info'} size="sm" onClick={() => setOpenCloseLidState(UfoSpaceshipLidOpenCloseState.Open)}>OPEN LID</Button>
        </div>
        <div className={styles.SameTypeButtons}>
          {/* prettier-ignore */}
          <Button variant={headVisibilityState === HeadVisibility.Hidden ? 'primary' : 'info'} size="sm" onClick={() => setHeadVisibilityState(HeadVisibility.Hidden)}>HIDE HEAD</Button>
          {/* prettier-ignore */}
          <Button variant={headVisibilityState === HeadVisibility.Peeking ? 'primary' : 'info'} size="sm" onClick={() => setHeadVisibilityState(HeadVisibility.Peeking)}>PEEK HEAD</Button>
          {/* prettier-ignore */}
          <Button variant={headVisibilityState === HeadVisibility.Visible ? 'primary' : 'info'} size="sm" onClick={() => setHeadVisibilityState(HeadVisibility.Visible)}>SHOW HEAD</Button>
        </div>
        <div className={styles.SameTypeButtons}>
          {/* prettier-ignore */}
          <Button variant={mouthState === MouthState.Smiling ? 'primary' : 'info'} size="sm" onClick={() => setMouthState(MouthState.Smiling)}>SMILE</Button>
          {/* prettier-ignore */}
          <Button variant={mouthState === MouthState.Frown ? 'primary' : 'info'} size="sm" onClick={() => setMouthState(MouthState.Frown)}>FROWN</Button>
          {/* prettier-ignore */}
          <Button variant={mouthState === MouthState.Surprised ? 'primary' : 'info'} size="sm" onClick={() => setMouthState(MouthState.Surprised)}>SURPRISE</Button>
          {/* prettier-ignore */}
          <Button variant={mouthState === MouthState.Talking ? 'primary' : 'info'} size="sm" onClick={() => setMouthState(MouthState.Talking)}>TALK</Button>
          {/* prettier-ignore */}
          <Button variant={mouthState === MouthState.Neutral ? 'primary' : 'info'} size="sm" onClick={() => setMouthState(MouthState.Neutral)}>SILENT</Button>
        </div>
      </div>
    </div>
  );
};

export default RobotUfo;
