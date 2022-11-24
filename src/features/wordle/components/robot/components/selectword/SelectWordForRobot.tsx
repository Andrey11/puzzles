import React from 'react';
import { Button } from 'react-bootstrap';
import { useAppSelector } from 'app/hooks/hooks';
import { getSelectableWords } from '../../../dictionary/wordleDictionarySlice';
import WordSelector from '../../../dropdown/WordSelector';
import styles from './SelectWordForRobot.module.scss';

type SelectWordForRobotProps = {
  onWordSelected: (word: string) => void;
}

const SelectWordForRobot: React.FC<SelectWordForRobotProps> = (props) => {

  const selectableWords = useAppSelector(getSelectableWords);

  return (
    <div className={styles.SelectWordForRobotDisplay}>
      <WordSelector
        words={selectableWords}
        onWordSelected={(word: string) => props.onWordSelected(word)}
        placeholder={'Enter guess word'}
        autoFocus={false}
      />
      <Button
        size="sm"
        onClick={() => props.onWordSelected('JOKER')}
        variant="outline-primary"
      >
        RANDOM
      </Button>
    </div>
  );
};

export default SelectWordForRobot;
