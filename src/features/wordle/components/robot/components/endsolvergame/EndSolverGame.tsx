import React from 'react';
import { useAppSelector } from 'app/hooks/hooks';

import Button from 'react-bootstrap/Button';
import { Robot } from 'react-bootstrap-icons';

import { getWOD } from 'features/wordle/components/solver/wordleSolverSlice';
import { getAvailableWordCounts, getGuessWordsStatus } from 'features/wordle/components/robot/robotSolutionSlice';
import { IWordStatus } from 'features/wordle/components/robot/RobotSolver.types';

import styles from './EndSolverGame.module.scss';

type EndSolverGameProps = {
  onEndGameHandler: () => void;
};

const MAX_CHARS: number = 5;

type TColors = 'GREEN' | 'ORANGE' | 'GREY';

const EndSolverGame: React.FC<EndSolverGameProps> = (props) => {
  const wod: string = useAppSelector(getWOD);
  const wordsCounts: Array<number> = useAppSelector(getAvailableWordCounts);
  const guessWordsStatus: Array<IWordStatus> = useAppSelector(getGuessWordsStatus);

  const OColorMap = {
    GREEN: styles.ExactMatch,
    ORANGE: styles.Match,
    GREY: styles.Miss,
  };

  const renderSelectedWord = (word: string, cls: string, letterCls?: Array<string>): Array<JSX.Element> => {
    let chars: Array<JSX.Element> = [];
    for (let i = 0; i < MAX_CHARS; i++) {
      let char: string = '';
      char = word.at(i) || '';
      const lCls = letterCls ? OColorMap[letterCls[i] as TColors] : '';
      chars.push(
        <span key={`key_${char}_at_${i}`} className={`${cls} ${lCls}`}>
          {char}
        </span>
      );
    }

    return chars;
  };

  return (
    <div className={styles.EndGameSolutionAnalysisWrapper}>
      <div className={styles.EndGameSolutionAnalysisDisplay}>
        <span className={styles.InfoLabel}>
          <Robot size={18} /> was looking for word
        </span>
        <div>{renderSelectedWord(wod, styles.CellLetter)}</div>
        <div>
          <span className={styles.CountLabel}>Word count</span>
          {guessWordsStatus.map((wordStatus: IWordStatus, index: number) => {
            const elKey: string = `${wordStatus.word}_${index}`;
            const count: string = new Intl.NumberFormat().format(wordsCounts[index]);
            return (
              <div key={elKey}>
                <span key={`span_${elKey}`} className={styles.WordCount}>
                  {count}
                </span>
                {renderSelectedWord(wordStatus.word, styles.AnswerCellLetter, wordStatus.colors)}
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.ActionButtonsDisplay}>
        <Button onClick={() => props.onEndGameHandler()} variant="primary">
          OKAY
        </Button>
      </div>
    </div>
  );
};

export default EndSolverGame;
