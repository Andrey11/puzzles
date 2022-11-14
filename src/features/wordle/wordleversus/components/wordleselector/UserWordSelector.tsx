import React, { useMemo, useRef } from 'react';
import { SelectInstance } from 'react-select';
import { Robot } from 'react-bootstrap-icons';
import WordSelector from '../../../components/dropdown/WordSelector';

import styles from './UserWordSelector.module.scss';
import { useAppSelector } from '../../../../../app/hooks/hooks';
import { getDictionary } from '../../../components/dictionary/wordleDictionarySlice';

const NON_BREAKING_SPACE: JSX.Element = <>&nbsp;</>;

type WordSelectorCallback = (word: string) => void;
type WordSelectorProps = { onWordSelected: WordSelectorCallback };

const UserWordSelector: React.FC<WordSelectorProps> = (props) => {
  const selectRef = useRef<SelectInstance | null>();
  const targetRef = useRef(null);

  const dictionary = useAppSelector(getDictionary);

  const selectableWords = useMemo(() => {
    return dictionary.words.map((word: string) => ({
      value: word,
      label: word,
    }));
  }, [dictionary.words]);

  const onSelected = (selectedWord: string) => {
    props.onWordSelected(selectedWord);
  };

  return (
    <WordSelector
      refContainer={targetRef}
      refSelector={selectRef}
      words={selectableWords}
      onWordSelected={onSelected}
      placeholder={
        <span className={styles.PlaceholderMessage}>
          Enter wordle for{NON_BREAKING_SPACE}
          <span>
            <Robot size={24} />
          </span>
          {NON_BREAKING_SPACE} to solve
        </span>
      }
    />
  );
};

export default UserWordSelector;
