import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useAppSelector } from "../../../../app/hooks/hooks";
import { RootState } from "../../../../app/store";
import PuzzleWordleCell from "../cell/PuzzleWordleCell";
import { RowKey, ROW_IDS } from "../rowgroup/RowGroup.types";
import { getRowById } from "../rowgroup/rowGroupSlice";
import { getCurrentRoundAsNumber } from "../../wordleversus/game/wordleVersusGameSlice";
import { showInvalidWordAnimation } from "../../wordleversus/wordleVersusSlice";
import styles from "./WordleRow.module.scss";

interface IRowProps {
  rowId: ROW_IDS;
  rowNumber?: number;
  onAnimationEnd?: () => void;
  animatonDuration?: number;
}

export const toRowId = (rowId: ROW_IDS) => ROW_IDS[rowId as number] as RowKey;

const WordleRow: React.FunctionComponent<IRowProps> = ({
  rowId,
  onAnimationEnd = () => {},
  animatonDuration = 2100,
}: IRowProps) => {
  const notificationRef = useRef(null);

  const guessRow = useSelector((state: RootState) =>
    getRowById(state, toRowId(rowId))
  );
  const { cells } = guessRow;

  const currentGuessNum = useAppSelector(getCurrentRoundAsNumber);
  const animateInvalidWord = useAppSelector(showInvalidWordAnimation);

  // const playInvalidWordAnimation =
  //   animateInvalidWord && currentGuessNum === rowId;
  // console.log(`Should animate invalid in ${guessRow} and rowId ${rowId} and currentGuessNum is ${currentGuessNum}`);

  const [notificationCls, setNotificationCls] = useState(
    styles.ComponentWrapper
  );

  useEffect(() => {
    let invalidClass = "";
    if (animateInvalidWord && currentGuessNum === rowId) {
      invalidClass = styles.InvalidWord;
      console.log('Should play error animation');

      setTimeout(() => {
        console.log("Calling on invalid animation end");
        onAnimationEnd();
      }, animatonDuration);
    }

    setNotificationCls(`${styles.ComponentWrapper} ${invalidClass}`);
  }, [
    animatonDuration,
    onAnimationEnd,
    animateInvalidWord,
    currentGuessNum,
    rowId,
  ]);

  return (
    <div className={notificationCls}>
      <div ref={notificationRef} className={styles.GuessRowContainer}>
        <PuzzleWordleCell cellId="i1" cell={cells.CELL_1} />
        <PuzzleWordleCell cellId="i2" cell={cells.CELL_2} />
        <PuzzleWordleCell cellId="i3" cell={cells.CELL_3} />
        <PuzzleWordleCell cellId="i4" cell={cells.CELL_4} />
        <PuzzleWordleCell cellId="i5" cell={cells.CELL_5} />
      </div>
    </div>
  );
};

export default WordleRow;
