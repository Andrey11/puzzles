import { RootState } from 'app/store';
import React from 'react';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { useSelector } from 'react-redux';
import styles from './PuzzlesKeyboard.module.scss';
import { KeyboardLetter, LETTER_COLORS } from './PuzzlesKeyboard.types';
import { getKeyboardLetter } from './puzzlesKeyboardSlice';

interface LetterKeyProps {
  letterString: string;
  // letterColor?: string;
  // disabled?: boolean;
  mobileMode?: boolean;
  // checked?: boolean;
  onPressCallback?: (letter: KeyboardLetter) => void;
}

const LetterKey: React.FC<LetterKeyProps> = ({
  letterString,
  // letterColor = LETTER_COLORS.GREY_OUTLINE,
  // disabled = false,
  mobileMode = false,
  // checked = false,
  onPressCallback = () => {},
}: LetterKeyProps) => {
  const { letter, letterColor, disabled, checked } = useSelector((state: RootState) =>
    getKeyboardLetter(state, letterString)
  );

  const letterId = `letter_${letter}`;

  return (
    <section key={`key_${letterId}`}>
      <ToggleButton
        id={letterId}
        className={styles.LetterButton}
        checked={checked}
        variant={LETTER_COLORS[letterColor]}
        disabled={disabled}
        active={false}
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          event.stopPropagation();
          if (!mobileMode) {
            event.currentTarget.blur();
            onPressCallback(letter);
          }
        }}
        onTouchEnd={(event: React.TouchEvent<HTMLButtonElement>) => {
          event.stopPropagation();
          if (mobileMode) {
            onPressCallback(letter);
          }
        }}
        value={letter}
      >
        {letter}
      </ToggleButton>
    </section>
  );
};

export default LetterKey;
