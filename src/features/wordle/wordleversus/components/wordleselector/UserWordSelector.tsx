import React, { useMemo, useRef } from 'react';
import { SelectInstance } from 'react-select';
import WordSelector from '../../../components/dropdown/WordSelector';
import { useAppSelector } from 'app/hooks/hooks';
import { getDictionary } from '../../../components/dictionary/wordleDictionarySlice';
import { usePlaceholder } from '../../../../../components/placeholder/Placeholder';

type WordSelectorCallback = (word: string) => void;
type WordSelectorProps = { onWordSelected: WordSelectorCallback };

const UserWordSelector: React.FC<WordSelectorProps> = (props) => {
  const selectRef = useRef<SelectInstance<{ value: string; label: string }> | null>(null);
  const targetRef = useRef<HTMLDivElement>(null);

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

  const {PlaceholderWithIcon: PlaceholderMsg} = usePlaceholder({});

  return (
    <WordSelector
      refContainer={targetRef}
      refSelector={selectRef}
      words={selectableWords}
      onWordSelected={onSelected}
      placeholder={PlaceholderMsg}
    />
  );
};

export default UserWordSelector;
