import React, { useEffect, useMemo, useState } from 'react';

import { IWordleDictionary } from '../../PuzzleWordle.types';
import WordSelector from '../dropdown/WordSelector';

import { Search } from 'react-bootstrap-icons';

import styles from './WordleDictionary.module.scss';
import AlphabetScrollList from '../alphabetscroll/AlphabetScrollList';
import { useAppSelector } from '../../../../app/hooks/hooks';
import { isDictionaryLoaded, getDictionary } from '../../wordleSlice';

const WordleDictionary: React.FunctionComponent = () => {

  const dictionaryLoaded: boolean = useAppSelector(isDictionaryLoaded);
  const dictionary: IWordleDictionary = useAppSelector(getDictionary);
  
  const [wordSelected, setWordSelected] = useState<string>('');
  const [isReady, setReady] = useState<boolean>(false);

  useEffect(() => {
    if (dictionaryLoaded && dictionary.words.length > 0) {
      setReady(true);
    } else {
      setReady(false);
    }
  }, [dictionaryLoaded, dictionary]);

  const selectableWords = useMemo(() => {
    return dictionaryLoaded ? dictionary.words.map((word: string) => ({ value: word, label: word })) : [];
  }, [dictionaryLoaded, dictionary.words]);

  useEffect(() => {
    // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
    const vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, []);

  const renderDictionaryContainer = () => {
    if (isReady) {
      return (
        <div className={styles.PuzzleDictionary}>
          <div className={styles.WordSearchRow}>
            <Search className={styles.WordSearchRowIcon} size={24} />
            <WordSelector
              words={selectableWords}
              autoFocus={true}
              onWordSelected={setWordSelected}
              placeholder={<span className={styles.PlaceholderMessage}>Search</span>}
            />
          </div>
          <div className={styles.PuzzleDictionaryScrollListWrapper}>
          <AlphabetScrollList searchWord={wordSelected} />
          </div>
        </div>
      );
    }
    return <>DICTIONARY UNAVAILABLE</>;
  };

  return <>{renderDictionaryContainer()}</>;
};

export default WordleDictionary;
