import React, { useMemo, useRef } from 'react';
import { useAppDispatch, useAppSelector } from 'app/hooks/hooks';
import {
  addLetter,
  deleteLetter,
  onSubmitGuess,
} from './wordleVersusGameSlice';

import PuzzlesKeyboard from 'components/keyboard/PuzzlesKeyboard';
import NotificationOverlay from 'features/wordle/components/notification/NotificationOverlay';
import RowGroup from 'features/wordle/components/rowgroup/RowGroup';
import InteractiveRobot from 'features/wordle/components/robot/InteractiveRobot';

import styles from './WordleVersusGame.module.scss';
import {
  setShouldPickWod,
  setShouldShowEndMatchOverlay,
  setShouldShowRobot,
  setShouldShowStartMatchOverlay,
  shouldShowEndMatchOverlay,
  shouldShowRobot,
  shouldShowSelectWordOverlay,
  shouldShowStartMatchOverlay,
  startWordleVersusMatch,
  startWordleVersusNextGame,
} from '../wordleVersusSlice';

const WordleVersusGame: React.FC = () => {
  const guessRowTargetRef: React.RefObject<any> = useRef(null);

  const dispatch = useAppDispatch();

  const onEnterPressed = () => dispatch(onSubmitGuess());

  const onLetterPressed = (letter: string) => dispatch(addLetter(letter));

  const showRobot = useAppSelector(shouldShowRobot);
  const showSelectWordOverlay = useAppSelector(shouldShowSelectWordOverlay);
  const showStartMatchOverlay = useAppSelector(shouldShowStartMatchOverlay);
  const showEndMatchOverlay = useAppSelector(shouldShowEndMatchOverlay);

  const shouldShowOverlayMemo = useMemo(() => {
    return (
      showSelectWordOverlay || showStartMatchOverlay || showEndMatchOverlay
    );
  }, [showEndMatchOverlay, showSelectWordOverlay, showStartMatchOverlay]);

  const showRobotMemo = useMemo(() => {
    return showRobot || shouldShowOverlayMemo;
  }, [showRobot, shouldShowOverlayMemo]);

  const startNewMatch = () => {
    dispatch(startWordleVersusMatch());
    dispatch(setShouldPickWod(true));
    dispatch(setShouldShowRobot(false));
  };

  const endMatchCompleted = (playAgain: boolean) => {
    if (playAgain) {
      startNewMatch();
    } else {
      dispatch(setShouldShowEndMatchOverlay(false));
      setTimeout(() => {
        dispatch(setShouldShowStartMatchOverlay(true));
      }, 1000);
    }
  };

  const onSelectedWordForRobot = (word: string) => {
    dispatch(startWordleVersusNextGame(word));
  };

  const handleOnRobotClicked = () => {
    if (shouldShowOverlayMemo) {
      dispatch(setShouldShowRobot(true));
    } else {
      dispatch(setShouldShowRobot(!showRobot));
    }
  };

  const onDeletePressed = (event?: Event) => {
    const kbEvent = event as KeyboardEvent;
    if (kbEvent && kbEvent.key !== 'Backspace') {
      return;
    }
    dispatch(deleteLetter());
  };

  return (
    <section itemID="ActiveGameDisplay">
      <section itemID="GuessRowsDisplay">
        <div className={styles.GuessRowsWrapper}>
          <div ref={guessRowTargetRef} className={styles.GuessRowsDisplay}>
            <RowGroup />
          </div>
        </div>
      </section>

      <section
        itemID="InteractiveRobotDisplay"
        className={styles.RobotDisplay}
        // onClick={() => dispatch(setShouldShowRobot(!showRobot))}
      >
        <InteractiveRobot
          onRobotClicked={handleOnRobotClicked}
          showRobot={showRobotMemo}
          showSelectWordOverlay={showSelectWordOverlay}
          showStartMatchOverlay={showStartMatchOverlay}
          showEndMatchOverlay={showEndMatchOverlay}
          onSelectWordCallback={onSelectedWordForRobot}
          onStartMatchCallback={startNewMatch}
          onEndMatchCallback={endMatchCompleted}
        />
      </section>

      <hr />

      <section itemID="keyboardDisplay" className={styles.KeyboardWrapper}>
        <div className={styles.KeyboardDisplay}>
          <PuzzlesKeyboard
            onKeyPressed={onLetterPressed}
            onDeletePressed={onDeletePressed}
            onEnterPressed={onEnterPressed}
          />
        </div>
      </section>

      <NotificationOverlay targetRef={guessRowTargetRef} />
    </section>
  );
};

export default WordleVersusGame;
