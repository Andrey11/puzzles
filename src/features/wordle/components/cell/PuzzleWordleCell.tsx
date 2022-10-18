import React, { useEffect, useRef } from 'react';
import useDeviceDetect from '../../../../app/hooks/useDeviceDetect';

import styles from './PuzzleWordleCell.module.scss';

export interface IPuzzleDetailsCell {
  cellId: string;
  letter: string;
  color: string;
  onLetterChange?: (letter: string) => void;
  onCellSelected?: (cellId: number) => void;
  onDeleteKeyPressed?: () => void;
  selected?: boolean;
  showSelected?: boolean;
}

type StyleMapType = {
  green: string;
  orange: string;
  grey: string;
};

const PuzzleWordleCell: React.FunctionComponent<IPuzzleDetailsCell> = ({
  cellId, letter, color, 
  onLetterChange = () => {},
  onCellSelected = () => {},
  onDeleteKeyPressed = () => {},
  selected, showSelected,
}: IPuzzleDetailsCell) => {
  const styleMap: StyleMapType = {
    green: styles.ExactMatch,
    orange: styles.Match,
    grey: styles.Miss,
  };

  const cellRef = useRef<HTMLInputElement>(null);
  const { isMobile } = useDeviceDetect();

  const clsName = color !== '' ? styleMap[color as keyof StyleMapType] : '';
  const selectedCls = (!!showSelected && !!selected) ? styles.Selected : '';

  useEffect(() => {
    if(selected) {
      cellRef.current?.focus();
    }
  }, [selected]);
  
  return (
    <input 
      itemID={cellId} 
      ref={cellRef}
      className={`${styles.Cell} ${selectedCls} ${clsName}`} 
      onSelect={() => onCellSelected(parseInt(cellId))}
      type="text"
      readOnly={isMobile}
      minLength={1}
      maxLength={1}
      pattern="[A-Z]{1}" 
      onKeyUp={(event) => {
        event.stopPropagation();
        event.preventDefault();
        if(event.key === 'Backspace') {
          onDeleteKeyPressed();
        }
      }}
      size={1}
      value={letter}
      onChange={(event) => {
        const isDeleteKey = (event.nativeEvent as InputEvent).inputType === 'deleteContentBackward';
        if (!isDeleteKey) {
          onLetterChange(event.target.value.toUpperCase())
        }
      }}
    />
  );
};

export default PuzzleWordleCell;
