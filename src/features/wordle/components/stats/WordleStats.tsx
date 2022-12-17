import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'app/hooks/hooks';
import useAddEventListener from 'app/hooks/useAddEventListener';

import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import { CheckSquare, QuestionSquare, XSquare, ArrowClockwise, Square } from 'react-bootstrap-icons';

import PuzzlesKeyboard from 'components/keyboard/PuzzlesKeyboard';

import { getLogStyles } from 'features/wordle/PuzzleWordle-helpers';
import { MATCH_TYPE_EXACT, MATCH_TYPE_EXISTS, MATCH_TYPE_MISSING } from 'features/wordle/PuzzleWordle.types';
import MatchTypeRadioGroup from 'features/wordle/components/radiogroup/MatchTypeRadioGroup';
import { CellKey, ROW_IDS } from 'features/wordle/components/rowgroup/RowGroup.types';
import RowGroup from 'features/wordle/components/rowgroup/RowGroup';

import { getDictionary } from 'features/wordle/components/dictionary/wordleDictionarySlice';
import { isScreenStatsActive } from 'features/wordle/wordlesolver/wordleSlice';
import MatchedWordsDialog from './dialog/MatchedWordsDialog';
import {
  getCalculatedMatchedWords,
  getMatchLettersAsLetterSpots,
  getMissingLetters,
  getSelectedMatchType,
  isCompleted,
  ISelectedLetter,
  onCalculateStatsAction,
  onDeleteAction,
  onMatchTypeChange,
  onStatsScreenActivated,
  updateLetter,
  updateSelectedCell,
} from './wordleStatsSlice';

import styles from './WordleStats.module.scss';

type IPuzzleDetailStatsProps = {
  isReady?: boolean;
};

export const MatchTypes = {
  MATCH_TYPE_EXACT: {
    type: MATCH_TYPE_EXACT,
    variant: 'outline-success',
    label: 'Right spot',
  },
  MATCH_TYPE_EXISTS: {
    type: MATCH_TYPE_EXISTS,
    variant: 'outline-warning',
    label: 'Wrong spot',
  },
  MATCH_TYPE_MISSING: {
    type: MATCH_TYPE_MISSING,
    variant: 'outline-secondary',
    label: 'Not in word',
  },
} as const;

const WordleStatsLog = getLogStyles({
  cmpName: 'WordleStats',
  cmpNameCls: 'color: #b5900e; font-weight: bold;',
});

const WordleStats: React.FunctionComponent<IPuzzleDetailStatsProps> = ({ isReady }: IPuzzleDetailStatsProps) => {
  const statsOverlayRef = useRef(null);
  const overlayRef = useRef(null);
  /** Dictionary redux props */
  const dictionary = useAppSelector(getDictionary);
  const missingLetters = useAppSelector(getMissingLetters);
  const letterSpots: Array<ISelectedLetter> = useAppSelector(getMatchLettersAsLetterSpots);

  const dispatch = useAppDispatch();

  // const { isMobile, deviceWidth, isDeviceWidthXXS, isDeviceWidthXS } = useDeviceDetect();

  const [statResult, setStatResult] = useState<string>('');
  const [possibleMatches, setPossibleMatches] = useState<Array<number>>([]);
  const [showMatchedWordsDialog, setShowMatchedWordsDialog] = useState<boolean>(false);

  const selectedMatchType = useAppSelector(getSelectedMatchType);
  const isActiveTab = useAppSelector(isScreenStatsActive);
  const calcultedMatchWords = useAppSelector(getCalculatedMatchedWords);
  const isCalculated = useAppSelector(isCompleted);

  /** STATS SCREEN ACTIVATON EFFECT */
  useEffect(() => {
    if (!isReady) return;

    if (isActiveTab) {
      console.log(...WordleStatsLog.logAction('tab stats is active'));
      dispatch(onStatsScreenActivated());
    } else {
      console.log(...WordleStatsLog.logAction('tab stats is not active'));
    }
  }, [dispatch, isActiveTab, isReady]);

  useEffect(() => {
    if (calcultedMatchWords) {
      const wordCount: number = calcultedMatchWords.guessWords.length;
      setStatResult(`${wordCount} WORD${wordCount !== 1 ? 'S' : ''}`);
      setPossibleMatches(calcultedMatchWords.guessWordsIndexes);
    }
  }, [calcultedMatchWords]);

  const onCellSelectedHandler = (rowKey: ROW_IDS, cellKey: CellKey) => {
    console.log(...WordleStatsLog.logAction(`updating: cellKey = (${cellKey})`));
    dispatch(updateSelectedCell(cellKey));
  };

  const onLetterPressed = (letter: string) => {
    console.log(...WordleStatsLog.logAction(`onLetterPressed: letter = (${letter})`));
    dispatch(updateLetter(letter));
  };

  const onDeletePressed = (event?: Event) => {
    const kbEvent = event as KeyboardEvent;
    if (kbEvent && kbEvent.key !== 'Backspace') {
      return;
    }

    dispatch(onDeleteAction());
  };

  const doCalculateStats = () => {
    dispatch(onCalculateStatsAction());
  };

  const getCounts = (): JSX.Element => {
    const totalBadge = <Badge bg="primary">{dictionary?.words.length} WORDS</Badge>;
    return (
      <div ref={statsOverlayRef} className={styles.TotalCountStats}>
        {isCalculated && (
          <span className={styles.TotalLetterLabel}>
            <span>FOUND{' '}</span>
            <Badge bg="success" onClick={() => setShowMatchedWordsDialog(possibleMatches.length > 0)}>
              {statResult}
            </Badge>
            <Button className={styles.ResetButton}>
              <ArrowClockwise />
            </Button>
          </span>
        )}{' '}
        <span className={styles.TotalCountLabel}>TOTAL {totalBadge}</span>
      </div>
    );
  };

  const getMatchTypeLabel = (icon: JSX.Element, labelShortText: string, labelText: string): JSX.Element => {
    // const lessThanLaptopWidth = deviceWidth === 's' || deviceWidth === 'm';
    // if (isDeviceWidthXXS() || isDeviceWidthXS()) {
    return (
      <>
        <Square size={18} /> {icon} <Square size={18} />
      </>
    );
    // } else if (isMobile || lessThanLaptopWidth) {
    //   return <>{labelShortText}</>;
    // }
    // return (
    //   <>
    //     {icon} {labelText}
    //   </>
    // );
  };

  useAddEventListener('keyup', onDeletePressed);

  return (
    <div className={styles.DisplayWrapper}>
      <div className={styles.Display}>
        {getCounts()}
        <hr />
        <section itemID="WordleStatsRowCells" ref={overlayRef} className={styles.WordleStatsRowCellsDisplay}>
          <RowGroup rowCount={1} canSelectCells={true} onCellSelected={onCellSelectedHandler} />
        </section>

        <hr />
        <section itemID="keyboardDisplay" className={styles.KeyboardWrapper}>
          <div className={styles.KeyboardDisplay}>
            <PuzzlesKeyboard
              onKeyPressed={onLetterPressed}
              onDeletePressed={onDeletePressed}
              onEnterPressed={doCalculateStats}
            />
          </div>
        </section>
        <hr />
        <div className={styles.MatchTypeSelectionLabel}>Match type for letters in word</div>
        <MatchTypeRadioGroup
          matchTypes={[
            {
              type: MATCH_TYPE_EXACT,
              variant: 'outline-success',
              label: getMatchTypeLabel(<CheckSquare size={18} />, 'Right spot', 'Letter is in a right spot'),
            },
            {
              type: MATCH_TYPE_EXISTS,
              variant: 'outline-warning',
              label: getMatchTypeLabel(<QuestionSquare size={18} />, 'Wrong spot', 'Letter is in a wrong spot'),
            },
            {
              type: MATCH_TYPE_MISSING,
              variant: 'outline-secondary',
              label: getMatchTypeLabel(<XSquare size={18} />, 'Not in word', 'Letter is not in a word'),
            },
          ]}
          onChange={(matchType: string) => {
            matchType === MATCH_TYPE_EXACT
              ? dispatch(onMatchTypeChange(MatchTypes.MATCH_TYPE_EXACT))
              : matchType === MATCH_TYPE_EXISTS
              ? dispatch(onMatchTypeChange(MatchTypes.MATCH_TYPE_EXISTS))
              : dispatch(onMatchTypeChange(MatchTypes.MATCH_TYPE_MISSING));
          }}
          selectedType={selectedMatchType.type}
        />
      </div>

      <MatchedWordsDialog
        dictionary={dictionary}
        letterSpots={letterSpots}
        matchedWords={possibleMatches}
        missingLetters={missingLetters}
        showDialog={showMatchedWordsDialog}
        onCloseDialog={() => setShowMatchedWordsDialog(false)}
      />
    </div>
  );
};

export default WordleStats;
