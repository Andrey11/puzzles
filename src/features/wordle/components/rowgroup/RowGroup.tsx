import React from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../../app/hooks/hooks";
import { RootState } from "../../../../app/store";
import WordleRow from "../row/WordleRow";
import {
  getUserGuess,
  setAnimateInvalidWord,
} from "../wordleversus/wordleVersusSlice";
import { ROW_IDS } from "./RowGroup.types";

const RowGroup: React.FunctionComponent = () => {
  const dispatch = useAppDispatch();

  const guess1 = useSelector((state: RootState) => getUserGuess(state, 1));
  const guess2 = useSelector((state: RootState) => getUserGuess(state, 2));
  const guess3 = useSelector((state: RootState) => getUserGuess(state, 3));
  const guess4 = useSelector((state: RootState) => getUserGuess(state, 4));
  const guess5 = useSelector((state: RootState) => getUserGuess(state, 5));
  const guess6 = useSelector((state: RootState) => getUserGuess(state, 6));

  return (
    <>
      <WordleRow
        rowId={ROW_IDS.ROW_1}
        guess={guess1}
        onInvalidWordAnimationEnd={() => dispatch(setAnimateInvalidWord(false))}
      />
      <WordleRow
        rowId={ROW_IDS.ROW_2}
        guess={guess2}
        onInvalidWordAnimationEnd={() => dispatch(setAnimateInvalidWord(false))}
      />
      <WordleRow
        rowId={ROW_IDS.ROW_3}
        guess={guess3}
        onInvalidWordAnimationEnd={() => dispatch(setAnimateInvalidWord(false))}
      />
      <WordleRow
        rowId={ROW_IDS.ROW_4}
        guess={guess4}
        onInvalidWordAnimationEnd={() => dispatch(setAnimateInvalidWord(false))}
      />
      <WordleRow
        rowId={ROW_IDS.ROW_5}
        guess={guess5}
        onInvalidWordAnimationEnd={() => dispatch(setAnimateInvalidWord(false))}
      />
      <WordleRow
        rowId={ROW_IDS.ROW_6}
        guess={guess6}
        onInvalidWordAnimationEnd={() => dispatch(setAnimateInvalidWord(false))}
      />
    </>
  );
};

export default RowGroup;
