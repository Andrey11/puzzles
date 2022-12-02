import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useAppSelector } from 'app/hooks/hooks';
import { getSelectableWords } from '../../../dictionary/wordleDictionarySlice';
import WordSelector from '../../../dropdown/WordSelector';
import styles from './SelectWordForRobot.module.scss';
import { getRandomWord } from 'features/wordle/PuzzleWordle-helpers';

type SelectWordForRobotProps = {
  onWordSelected: (word: string) => void;
};

const MAX_CHARS: number = 5;

const SelectWordForRobot: React.FC<SelectWordForRobotProps> = (props) => {
  const [selectedWord, setSelectedWord] = useState<string>('');

  const selectableWords = useAppSelector(getSelectableWords);

  const renderSelectedWord = (): Array<JSX.Element> => {
    let chars: Array<JSX.Element> = [];
    for (let i = 0; i < MAX_CHARS; i++) {
      let char: string = '';
      char = selectedWord.at(i) || '';
      chars.push(
        <span key={`char_at_${i}`} className={styles.CellLetter}>
          {char}
        </span>
      );
    }

    return chars;
  };

  return (
    <div className={styles.SelectWordForRobotWrapper}>
      <div className={styles.SelectorsDisplay}>
        <WordSelector
          words={selectableWords}
          onWordSelected={(word: string) => setSelectedWord(word)}
          placeholder={'Enter guess word'}
          autoFocus={false}
        />
        <Button
          size="sm"
          className={styles.RandomButton}
          onClick={() => setSelectedWord(getRandomWord())}
          variant="outline-primary"
        >
          RANDOM
        </Button>
      </div>
      <div className={styles.SelectedWordDisplay}>{renderSelectedWord()}</div>
      <div className={styles.ActionButtonsDisplay}>
        <Button onClick={() => props.onWordSelected(selectedWord)} variant="primary">
          SUBMIT
        </Button>
      </div>
    </div>
  );
};

export default SelectWordForRobot;
