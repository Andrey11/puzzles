import React, { useRef } from 'react';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import {
  addLetter,
  deleteLetter,
  onSubmitGuess,
} from './wordleVersusGameSlice';

import PuzzlesKeyboard from '../../../../components/keyboard/PuzzlesKeyboard';
import NotificationOverlay from '../../components/notification/NotificationOverlay';
import RowGroup from '../../components/rowgroup/RowGroup';

import styles from './WordleVersusGame.module.scss';

const WordleVersusGame: React.FC = () => {
  const guessRowTargetRef: React.RefObject<any> = useRef(null);

  const dispatch = useAppDispatch();

  const onEnterPressed = () => dispatch(onSubmitGuess());
  
  const onLetterPressed = (letter: string) => dispatch(addLetter(letter));

  const onDeletePressed = (event?: Event) => {
    const kbEvent = event as KeyboardEvent;
    if (kbEvent && kbEvent.key !== 'Backspace') {
      return;
    }
    dispatch(deleteLetter());
  };


  return (
    <section itemID="activeGameDisplay">
      <section itemID="guessRowsDisplay">
        <div className={styles.GuessRowsDisplayWrapper}>
          <div ref={guessRowTargetRef} className={styles.GuessRowsDisplay}>
            <RowGroup />
          </div>
        </div>
      </section>

      <hr />

      <section itemID="keyboardDisplay">
        <div className={styles.KeyboardContainer}>
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
