import React, { useEffect, useRef } from "react";
import useDeviceDetect from "../../../../app/hooks/useDeviceDetect";
import { IWordleRowCellUI } from "../rowgroup/RowGroup.types";

import styles from "./PuzzleWordleCell.module.scss";

export interface IWordleLetterCell {
  cellId: string;
  letter?: string;
  color?: string;
  onLetterChange?: (letter: string) => void;
  onCellSelected?: (cellId: number) => void;
  onDeleteKeyPressed?: () => void;
  selected?: boolean;
  showSelected?: boolean;
  showEmptyValueStyle?: boolean;
  disabled?: boolean;
  cell?: IWordleRowCellUI;
  rowId?: string;
  classStyle?: string;
}

type StyleMapType = {
  green: string;
  orange: string;
  grey: string;
  transparent: string;
  success: string;
  warning: string;
  secondary: string;
};

const PuzzleWordleCell: React.FunctionComponent<IWordleLetterCell> = ({
  cellId,
  cell,
  onLetterChange = () => {},
  onCellSelected = () => {},
  onDeleteKeyPressed = () => {},
  selected,
  showSelected,
  disabled = true,
  classStyle = '',
  showEmptyValueStyle = true,
}: IWordleLetterCell) => {
  const styleMap: StyleMapType = {
    green: styles.ExactMatch,
    orange: styles.Match,
    grey: styles.Miss,
    transparent: "",
    success: styles.ExactMatch,
    warning: styles.Match,
    secondary: styles.Miss,
  };

  const cellRef = useRef<HTMLInputElement>(null);
  const { isMobile } = useDeviceDetect();

  const clsName =
    styleMap[(cell?.color || "transparent") as keyof StyleMapType] || "";
  const selectedCls = !!showSelected && !!selected ? styles.Selected : "";

  useEffect(() => {
    if (selected) {
      cellRef.current?.focus();
    }
  }, [selected]);

  return (
    <div className={`${styles.Cell} ${selectedCls} ${clsName} ${classStyle}`}>
      <input
        itemID={cellId}
        className={showEmptyValueStyle ? styles.showEmptyStyle : ''}
        ref={cellRef}
        onSelect={() => onCellSelected(parseInt(cellId))}
        type="text"
        readOnly={isMobile}
        disabled={disabled}
        minLength={1}
        maxLength={1}
        pattern="[A-Z]{1}"
        onKeyUp={(event) => {
          event.stopPropagation();
          event.preventDefault();
          if (event.key === "Backspace") {
            onDeleteKeyPressed();
          }
        }}
        size={1}
        value={cell?.letter || ""}
        onChange={(event) => {
          const isDeleteKey =
            (event.nativeEvent as InputEvent).inputType ===
            "deleteContentBackward";
          if (!isDeleteKey) {
            onLetterChange(event.target.value.toUpperCase());
          }
        }}
      />
    </div>
  );
};

export default PuzzleWordleCell;
