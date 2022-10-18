import React, { useEffect, useState } from "react";
import {
  LOG_CLS_DATA,
  LOG_CLS_FAILURE,
  LOG_CLS_INFO,
  LOG_CLS_SUCCESS,
} from "../../PuzzleWordle-helpers";
import { IWordleDictionary, Letters } from "../../PuzzleWordle.types";

import WordleDictionaryWord from "../dictionary/WordleDictionaryWord";

import styles from "./AlphabetScrollList.module.scss";
import { useAppSelector } from "../../../../app/hooks/hooks";
import { getDictionary, isScreenDictionaryActive } from "../../wordleSlice";

type IAlphabetScrollWordsByLetterProps = {
  letter: string;
  isActiveLetter: boolean;
};

const AlphabetScrollWordsByLetter: React.FunctionComponent<
  IAlphabetScrollWordsByLetterProps
> = ({ letter, isActiveLetter }: IAlphabetScrollWordsByLetterProps) => {
  const dictionary: IWordleDictionary = useAppSelector(getDictionary);
  const wordsStartingWithLetter = dictionary.wordsBy[letter as Letters];
  const isActiveScreen = useAppSelector(isScreenDictionaryActive);
  const [wordElements, setWordElements] = useState<Array<JSX.Element>>();

  useEffect(() => {
    if (!wordElements) {
      console.log(
        `%cRendering words for letter %c${letter}`,
        LOG_CLS_INFO,
        LOG_CLS_DATA
      );
      const puzzleWords = wordsStartingWithLetter.map(
        (wd: string, index: number) => {
          const wordKey = `words_by_${letter}_${wd}`;
          const wordId = index === 0 ? `words_by_${letter}` : wordKey;
          return (
            <WordleDictionaryWord wordId={wordId} key={wordKey} word={wd} />
          );
        }
      );

      // Add letter header row
      puzzleWords.unshift(renderLetterTitleRow(letter));
      setWordElements(puzzleWords);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderLetterTitleRow = (startingLetter: string): JSX.Element => {
    const rowKey = `l_${startingLetter}`;
    const headerId = `letter_header_row_${startingLetter}`;
    return (
      <dt id={headerId} key={rowKey} className={styles.AlphabetListTitleRow}>
        {startingLetter}
      </dt>
    );
  };

  const displayedWords = (maxWords: boolean): ReadonlyArray<JSX.Element> => {
    if (wordElements && isActiveScreen) {
      const puzzleWords = [...wordElements];
      if (wordsStartingWithLetter.length > 20 && maxWords) {
        console.log(
          `%cRendering %c${wordsStartingWithLetter.length} %c words for letter %c${letter}%c letter is %c${maxWords}`,
          LOG_CLS_INFO,
          LOG_CLS_DATA,
          LOG_CLS_INFO,
          LOG_CLS_DATA,
          LOG_CLS_INFO,
          maxWords ? LOG_CLS_SUCCESS : LOG_CLS_FAILURE
        );
      }      
      return puzzleWords.slice(0, maxWords ? puzzleWords.length - 1 : 20);
    }

    return [<></>];
  };

  return (
    <div key={`wd_start_by_${letter}`}>{displayedWords(isActiveLetter)}</div>
  );
};

export default AlphabetScrollWordsByLetter;
