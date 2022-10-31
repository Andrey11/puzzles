import React, { useMemo, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks/hooks";
import { SelectInstance } from "react-select";

import { IWordleDictionary } from "../../PuzzleWordle.types";
import { getDictionary, isDictionaryLoaded } from "../../wordleSlice";
import WordSelector from "../dropdown/WordSelector";
import { setWOD } from "./wordleVersusGameSlice";

import { Robot } from "react-bootstrap-icons";
import styles from "./PuzzleWordleVersus.module.scss";

const NON_BREAKING_SPACE: JSX.Element = <>&nbsp;</>;

const UserWordSelector: React.FC = () => {
  const selectRef = useRef<SelectInstance | null>();
  const targetRef = useRef(null);

  const dispatch = useAppDispatch();

  const dictionary: IWordleDictionary = useAppSelector(getDictionary);
  const dictionaryLoaded = useAppSelector(isDictionaryLoaded);

  const selectableWords = useMemo(() => {
    return dictionary.words.map((word: string) => ({
      value: word,
      label: word,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dictionaryLoaded]);

  const onWordSelected = (selectedWord: string) => {
    dispatch(setWOD(selectedWord));
  };

  return (
    <WordSelector
      refContainer={targetRef}
      refSelector={selectRef}
      words={selectableWords}
      onWordSelected={onWordSelected}
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
