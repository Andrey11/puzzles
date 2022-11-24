import React from "react";
import useDeviceDetect from "app/hooks/useDeviceDetect";
import { ALPHABET } from "features/wordle/PuzzleWords";
import LetterKey from "./LetterKey";
import Button from "react-bootstrap/Button";
import { Backspace, BoxArrowRight } from "react-bootstrap-icons";

import styles from './PuzzlesKeyboard.module.scss';

interface PuzzlesKeyboardProps {
  onKeyPressed: (letter: string) => void;
  onDeletePressed: (event?: Event) => void;
  onEnterPressed: () => void;
}

const PuzzlesKeyboard: React.FC<PuzzlesKeyboardProps> = ({
  onKeyPressed,
  onDeletePressed,
  onEnterPressed,
}: PuzzlesKeyboardProps) => {
  const { isMobile } = useDeviceDetect();
  
  const deleteButton = (
    <Button
      key="delete-btn"
      variant="outline-danger"
      active={false}
      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        if (!isMobile) {
          event.currentTarget.blur();
          onDeletePressed();
          console.log("Click Delete event");
        }
      }}
      onTouchEnd={(event: React.TouchEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        if (isMobile) {
          event.currentTarget.blur();
          onDeletePressed();
        }
      }}
      className={styles.DeleteButton}
    >
      <Backspace size={18} />
    </Button>
  );
  
  const enterButton = (
    <Button
      key="enter-btn"
      variant="outline-success"
      active={false}
      value={1}
      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        if (!isMobile) {
          event.currentTarget.blur();
          onEnterPressed();
          console.log("Click Enter event");
        }
      }}
      onTouchEnd={(event: React.TouchEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        if (isMobile) {
          event.currentTarget.blur();
          onEnterPressed();
          console.log("Touch Enter event");
        }
      }}
      className={styles.EnterButton}
    >
      <BoxArrowRight size={18} />
    </Button>
  );

  const renderKeyboardKeys = () => {
    const letterElements = ALPHABET.map((ltr, index) => (
      <LetterKey 
        key={`${ltr}_${index}`} 
        letterString={ltr} 
        mobileMode={isMobile}
        onPressCallback={onKeyPressed} />
    ));

    const keyboardKeys = letterElements.slice(0, letterElements.length - 2);
    keyboardKeys.push(enterButton);
    keyboardKeys.push(...letterElements.slice(letterElements.length - 2));
    keyboardKeys.push(deleteButton);

    return keyboardKeys;
  };

  return (
    <>
      {renderKeyboardKeys()}
    </>
  );
};

export default PuzzlesKeyboard;
