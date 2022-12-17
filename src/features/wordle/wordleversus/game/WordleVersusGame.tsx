import React, { useMemo, useRef } from 'react';
import { useAppDispatch, useAppSelector } from 'app/hooks/hooks';

import PuzzlesKeyboard from 'components/keyboard/PuzzlesKeyboard';

import NotificationOverlay from 'features/wordle/components/notification/NotificationOverlay';
import RowGroup from 'features/wordle/components/rowgroup/RowGroup';
import InteractiveRobot from 'features/wordle/components/robot/InteractiveRobot';
import { getLogStyles } from 'features/wordle/PuzzleWordle-helpers';

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
} from 'features/wordle/wordleversus/wordleVersusSlice';
import { addLetter, deleteLetter, onSubmitGuess } from './wordleVersusGameSlice';


import styles from './WordleVersusGame.module.scss';

const WvGameLog = getLogStyles({
  cmpName: 'WordleVersusGame',
  cmpNameCls: 'color: #3dc6a6; font-weight: bold;',
});

type WordleVersusGameProps = {
  isInit: boolean;
};

const WordleVersusGame: React.FC<WordleVersusGameProps> = ({ isInit }: WordleVersusGameProps) => {
  const guessRowTargetRef: React.RefObject<any> = useRef(null);
  const overlayRef: React.RefObject<any> = useRef(null);

  const dispatch = useAppDispatch();

  const onEnterPressed = () => dispatch(onSubmitGuess());

  const onLetterPressed = (letter: string) => dispatch(addLetter(letter));

  const showRobot = useAppSelector(shouldShowRobot);
  const showSelectWordOverlay = useAppSelector(shouldShowSelectWordOverlay);
  const showStartMatchOverlay = useAppSelector(shouldShowStartMatchOverlay);
  const showEndMatchOverlay = useAppSelector(shouldShowEndMatchOverlay);

  const shouldShowOverlayMemo = useMemo(() => {
    return showSelectWordOverlay || showStartMatchOverlay || showEndMatchOverlay;
  }, [showEndMatchOverlay, showSelectWordOverlay, showStartMatchOverlay]);

  const showRobotMemo = useMemo(() => {
    return showRobot || shouldShowOverlayMemo;
  }, [showRobot, shouldShowOverlayMemo]);

  const startNewMatch = () => {
    dispatch(startWordleVersusMatch());
    dispatch(setShouldPickWod(true));
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
    console.log(...WvGameLog.logAction(`Clicked on robot whose state is ${showRobot}`));

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
    <section ref={overlayRef} itemID="ActiveGameDisplay">
      <section itemID="InteractiveRobotDisplay" className={styles.RobotDisplay}>
        <InteractiveRobot
          isInit={isInit}
          onRobotClicked={handleOnRobotClicked}
          showRobot={showRobotMemo}
          showSelectWordOverlay={showSelectWordOverlay}
          showStartMatchOverlay={showStartMatchOverlay}
          showEndMatchOverlay={showEndMatchOverlay}
          onSelectWordCallback={onSelectedWordForRobot}
          onStartMatchCallback={startNewMatch}
          onEndMatchCallback={endMatchCompleted}
          overlayBodyRef={overlayRef}
        />
      </section>

      <section itemID="GuessRowsDisplay">
        <div className={styles.GuessRowsWrapper}>
          <div ref={guessRowTargetRef} className={styles.GuessRowsDisplay}>
            <RowGroup />
          </div>
        </div>
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
