import React from "react";
import { useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks/hooks";
import { RootState } from "../../../../app/store";
import WordleRow from "../row/WordleRow";
import {
  getCurrentUserGuess,
  getUserGuess,
  setAnimateInvalidWord,
  showInvalidWordAnimation,
} from "../wordleversus/wordleVersusSlice";

const RowGroup: React.FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const currentGuessNum = useAppSelector(getCurrentUserGuess);
  const animateInvalidWord = useAppSelector(showInvalidWordAnimation);

  const guess1 = useSelector((state: RootState) => getUserGuess(state, 1));
  const guess2 = useSelector((state: RootState) => getUserGuess(state, 2));
  const guess3 = useSelector((state: RootState) => getUserGuess(state, 3));
  const guess4 = useSelector((state: RootState) => getUserGuess(state, 4));
  const guess5 = useSelector((state: RootState) => getUserGuess(state, 5));
  const guess6 = useSelector((state: RootState) => getUserGuess(state, 6));

  return (
    <>
      <WordleRow
        guess={guess1}
        playInvalidWordAnimation={currentGuessNum === 1 && animateInvalidWord}
        onInvalidWordAnimationEnd={() => dispatch(setAnimateInvalidWord(false))}
      />
      <WordleRow
        guess={guess2}
        playInvalidWordAnimation={currentGuessNum === 2 && animateInvalidWord}
        onInvalidWordAnimationEnd={() => dispatch(setAnimateInvalidWord(false))}
      />
      <WordleRow
        guess={guess3}
        playInvalidWordAnimation={currentGuessNum === 3 && animateInvalidWord}
        onInvalidWordAnimationEnd={() => dispatch(setAnimateInvalidWord(false))}
      />
      <WordleRow
        guess={guess4}
        playInvalidWordAnimation={currentGuessNum === 4 && animateInvalidWord}
        onInvalidWordAnimationEnd={() => dispatch(setAnimateInvalidWord(false))}
      />
      <WordleRow
        guess={guess5}
        playInvalidWordAnimation={currentGuessNum === 5 && animateInvalidWord}
        onInvalidWordAnimationEnd={() => dispatch(setAnimateInvalidWord(false))}
      />
      <WordleRow
        guess={guess6}
        playInvalidWordAnimation={currentGuessNum === 6 && animateInvalidWord}
        onInvalidWordAnimationEnd={() => dispatch(setAnimateInvalidWord(false))}
      />
    </>
  );
};

export default RowGroup;
