import React, { useState } from 'react';
import { useAppSelector } from 'app/hooks/hooks';

import Button from 'react-bootstrap/Button';

import { getRandomWord } from 'features/wordle/PuzzleWordle-helpers';
import { getSelectableWords } from 'features/wordle/components/dictionary/wordleDictionarySlice';
import WordSelector from 'features/wordle/components/dropdown/WordSelector';

import styles from './SelectGuessAndStartWordsForRobot.module.scss';

type SelectGuessAndStartWordsForRobotProps = {
  onGuessAndStartWordSelected: (guessWord: string, startWord: string) => void;
};

const MAX_CHARS: number = 5;

const SelectGuessAndStartWordsForRobot: React.FC<SelectGuessAndStartWordsForRobotProps> = (props) => {
  const [selectedWord, setSelectedWord] = useState<string>('');
  const [startingWord, setStartingWord] = useState<string>('');

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

  const onSubmitPressed = () => {
    const startWord: string = startingWord !== '' ? startingWord : getRandomWord();
    props.onGuessAndStartWordSelected(selectedWord, startWord);
  };

  return (
    <div className={styles.SelectWordForRobotWrapper}>
      <div className={`${styles.SelectorsDisplay} ${styles.GuessWordDisplay}`}>
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
      <div className={`${styles.SelectorsDisplay} ${styles.FirstWordDisplay}`}>
        <span>You can also choose the first guess word</span>
        <WordSelector
          words={selectableWords}
          onWordSelected={(word: string) => setStartingWord(word)}
          placeholder={'Enter starting word'}
          autoFocus={false}
        />
      </div>
      <div className={styles.ActionButtonsDisplay}>
        <Button disabled={selectedWord.length !== MAX_CHARS} onClick={onSubmitPressed} variant="primary">
          SUBMIT
        </Button>
      </div>
    </div>
  );
};

export default SelectGuessAndStartWordsForRobot;
