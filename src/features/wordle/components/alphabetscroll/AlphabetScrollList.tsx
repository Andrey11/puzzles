import React, { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks/hooks";

import {
  LOG_CLS_WOD as CLS_WOD,
  LOG_CLS_INFO as CLS_INFO,
} from "../../PuzzleWordle-helpers";
import { ALPHABET } from "../../PuzzleWords";
// import { isScreenDictionaryActive } from "../../wordleSlice";
import {
  getActiveLetter,
  setActiveLetter,
} from "../dictionary/uiDictionarySlice";

import styles from "./AlphabetScrollList.module.scss";
import AlphabetScrollWordsByLetter from "./AlphabetScrollWordsByLetter";

type IAlphabetScrollListProps = {
  searchWord?: string;
};

const AlphabetScrollList: React.FunctionComponent<IAlphabetScrollListProps> = ({
  searchWord = "",
}: IAlphabetScrollListProps) => {
  const trackScrollRef = useRef(true);
  const dispatch = useAppDispatch();

  const activeLetter = useAppSelector(getActiveLetter);
  // const isActiveScreen = useAppSelector(isScreenDictionaryActive);

  useEffect(() => {
    if (searchWord !== "") {
      console.log(`%cSearch word is %c${searchWord}`, CLS_INFO, CLS_WOD);
      const firstChar = searchWord.charAt(0);
      dispatch(setActiveLetter(firstChar));
      trackScrollRef.current = false;
      setTimeout(() => {
        scrollElementIntoView(firstChar, searchWord);
      }, 300);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchWord]);

  const scrollListenerEvent = (event: any) => {
    if (!trackScrollRef.current) {
      return;
    }
    const scrollContainer = event.currentTarget;
    const containerBounds = scrollContainer.getBoundingClientRect();
    const containerTopOffset = containerBounds.top;

    const nodeEl = [...scrollContainer.childNodes].find((node: any) => {
      const nodeTopOffset = node.firstChild.getBoundingClientRect().top;
      return nodeTopOffset - containerTopOffset === 0;
    });

    if (nodeEl && nodeEl.firstChild.innerHTML !== activeLetter) {
      console.log(`Found active header: ${nodeEl.firstChild.innerHTML}`);
      dispatch(setActiveLetter(nodeEl.firstChild.innerHTML));
    }
  };

  const scrollElementIntoView = (elementId: string, word?: string) => {
    const wordEl = document.getElementById(
      `words_by_${elementId}_${word}_anchor`
    );
    const letterHeaderEl = document.getElementById(
      `words_by_${elementId}_anchor`
    );
    const el = wordEl !== null ? wordEl : letterHeaderEl;
    el?.scrollIntoView({ behavior: "auto", block: "start" });
    if (word && word !== "" && el !== null && el.nextElementSibling !== null) {
      const rowHighlighted = [
        { backgroundColor: "#2684ff" },
        { backgroundColor: "white" },
        { backgroundColor: "#2684ff" },
        { backgroundColor: "white" },
        { backgroundColor: "#2684ff" },
        { backgroundColor: "white" },
      ];
      const highlightTiming = {
        duration: 2000,
        iterations: 1,
      };
      el.nextElementSibling.animate(rowHighlighted, highlightTiming);
    }
    setTimeout(() => {
      trackScrollRef.current = true;
    }, 10);
  };

  const renderWordsByLetter = (letter: string) => (
    <AlphabetScrollWordsByLetter
      key={`lKey_${letter}`}
      letter={letter}
      isActiveLetter={
        activeLetter.charCodeAt(0) - letter.charCodeAt(0) >= -1 &&
        activeLetter.charCodeAt(0) - letter.charCodeAt(0) <= 1
      }
    />
  );

  const renderScrollTrackLetter = (letter: string) => (
    <div
      key={`key_${letter}`}
      className={`${styles.AlphabetScrollTrackLetter} ${
        activeLetter === letter ? styles.AlphabetScrollTrackLetterActive : ""
      }`}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        e.currentTarget.blur();
        trackScrollRef.current = false;
        dispatch(setActiveLetter(letter));
        scrollElementIntoView(letter);
      }}
    >
      {letter}
    </div>
  );

  return (
    <div className={styles.AlphabetScrollWrapper}>
      <dl
        id="sl"
        className={styles.AlphabetScrollList}
        onScroll={scrollListenerEvent}
      >
        {ALPHABET.map((letter) => renderWordsByLetter(letter))}
      </dl>
      <div className={styles.AlphabetScrollTrack}>
        {ALPHABET.map((letter) => renderScrollTrackLetter(letter))}
      </div>
    </div>
  );
};

export default AlphabetScrollList;
