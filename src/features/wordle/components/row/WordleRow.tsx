import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useAppSelector } from "../../../../app/hooks/hooks";
import { RootState } from "../../../../app/store";
import { IWordleRow } from "../../PuzzleWordle.types";
import PuzzleWordleCell from "../cell/PuzzleWordleCell";
import { RowKey, ROW_IDS } from "../rowgroup/RowGroup.types";
import { getRowById } from "../rowgroup/rowGroupSlice";
import {
  getCurrentUserGuess,
  showInvalidWordAnimation,
} from "../wordleversus/wordleVersusSlice";
import styles from "./WordleRow.module.scss";

interface IRowProps {
  rowId: ROW_IDS;
  guess: IWordleRow;
  rowNumber?: number;
  onInvalidWordAnimationEnd?: () => void;
  animatonDuration?: number;
}

export const toRowId = (rowId: ROW_IDS) => ROW_IDS[rowId as number] as RowKey;

const WordleRow: React.FunctionComponent<IRowProps> = ({
  rowId,
  onInvalidWordAnimationEnd = () => {},
  animatonDuration = 2100,
}: IRowProps) => {
  const notificationRef = useRef(null);

  const guessRow = useSelector((state: RootState) =>
    getRowById(state, toRowId(rowId))
  );
  const { cells } = guessRow;

  const currentGuessNum = useAppSelector(getCurrentUserGuess);
  const animateInvalidWord = useAppSelector(showInvalidWordAnimation);
  const playInvalidWordAnimation =
    animateInvalidWord && currentGuessNum === rowId;

  const [notificationCls, setNotificationCls] = useState(
    styles.ComponentWrapper
  );

  useEffect(() => {
    let invalidClass = "";
    if (playInvalidWordAnimation) {
      invalidClass = styles.InvalidWord;

      setTimeout(() => {
        console.log("Calling on invalid animation end");
        onInvalidWordAnimationEnd();
      }, animatonDuration);
    }

    setNotificationCls(`${styles.ComponentWrapper} ${invalidClass}`);
  }, [animatonDuration, onInvalidWordAnimationEnd, playInvalidWordAnimation]);

  return (
    <div className={notificationCls}>
      <div ref={notificationRef} className={styles.GuessRowContainer}>
        <PuzzleWordleCell
          cellId="i1"
          cell={cells.CELL_1}
        />
        <PuzzleWordleCell
          cellId="i2"
          cell={cells.CELL_2}
        />
        <PuzzleWordleCell
          cellId="i3"
          cell={cells.CELL_3}
        />
        <PuzzleWordleCell
          cellId="i4"
          cell={cells.CELL_4}
        />
        <PuzzleWordleCell
          cellId="i5"
          cell={cells.CELL_5}
        />
      </div>
    </div>
  );
};

export default WordleRow;
