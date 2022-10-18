import React, { useEffect, useState } from 'react';
import { IWordleRow } from '../PuzzleWordle.types';
import PuzzleWordleCell from './cell/PuzzleWordleCell';

import styles from './PuzzleComponents.module.scss';

interface IRowProps {
  guess: IWordleRow;
}

const PuzzleWordleRow: React.FunctionComponent<IRowProps> = (props) => {

  const { letters, colors } = props.guess; 
  
  const [cell1Value, setCell1Value] = useState('');
  const [cell1Color, setCell1Color] = useState('transparent');
  const [cell2Value, setCell2Value] = useState('');
  const [cell2Color, setCell2Color] = useState('transparent');
  const [cell3Value, setCell3Value] = useState('');
  const [cell3Color, setCell3Color] = useState('transparent');
  const [cell4Value, setCell4Value] = useState('');
  const [cell4Color, setCell4Color] = useState('transparent');
  const [cell5Value, setCell5Value] = useState('');
  const [cell5Color, setCell5Color] = useState('transparent');


  useEffect(() => {
    if (letters) {
      setCell1Value(letters[0]);
      setCell2Value(letters[1]);
      setCell3Value(letters[2]);
      setCell4Value(letters[3]);
      setCell5Value(letters[4]);
    } 
  }, [letters]);

  useEffect(() => {
    if (colors) {
      setCell1Color(colors[0]);
      setCell2Color(colors[1]);
      setCell3Color(colors[2]);
      setCell4Color(colors[3]);
      setCell5Color(colors[4]);
    } 
  }, [colors]);

  return (
        <div className={styles.GuessRowContainer}>
          <PuzzleWordleCell cellId="i1" letter={cell1Value} color={cell1Color} />
          <PuzzleWordleCell cellId="i2" letter={cell2Value} color={cell2Color} />
          <PuzzleWordleCell cellId="i3" letter={cell3Value} color={cell3Color} />
          <PuzzleWordleCell cellId="i4" letter={cell4Value} color={cell4Color} />
          <PuzzleWordleCell cellId="i5" letter={cell5Value} color={cell5Color} />
        </div>
  );
};

export default PuzzleWordleRow;
