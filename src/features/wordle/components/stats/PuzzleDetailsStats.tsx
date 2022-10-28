import React, { useCallback, useEffect, useRef, useState } from 'react';

import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { Backspace, FileEarmarkCheck, FileDiff, FileX } from 'react-bootstrap-icons';

import {
  getVariantBySelectedMatchType,
  intersectionArray,
  removeNonExistentLetterIndexes,
  getIndexByLetterCode,
  getLetterByIndexCode,
} from '../../PuzzleWordle-helpers';
import {
  IAnalyzerData,
  IWordleDictionary,
  ISelectedLetter,
  ISelectedLetters,
  MATCH_TYPE_EXACT,
  MATCH_TYPE_EXISTS,
  MATCH_TYPE_MISSING,
  MATCH_TYPE_NONE,
} from '../../PuzzleWordle.types';

import { allAvailableWords } from '../../PuzzleWords';
import MatchTypeRadioGroup from '../radiogroup/MatchTypeRadioGroup';
import PuzzleWordleCell from '../cell/PuzzleWordleCell';
import MatchedWordsDialog from './dialog/MatchedWordsDialog';
import useAddEventListener from '../../../../app/hooks/useAddEventListener';
import useDeviceDetect from '../../../../app/hooks/useDeviceDetect';

import styles from './PuzzleDetailsStats.module.scss';
import { useAppSelector } from '../../../../app/hooks/hooks';
import { getDictionary, isDictionaryLoaded } from '../../wordleSlice';

type IPuzzleDetailStatsProps = {
  analyzeSolution?: IAnalyzerData;
};

const DEFAULT_MATCH_TYPE = MATCH_TYPE_NONE;
const MAX_LETTER_SPOTS = 5;

const getInitLetterSpots = (): ISelectedLetters => {
  const spotLetters: ISelectedLetters = { spots: [] };

  for (let i = 0; i < MAX_LETTER_SPOTS; i++) {
    spotLetters.spots.push({ position: i, letter: '', matchType: DEFAULT_MATCH_TYPE });
  }

  return spotLetters;
};

const PuzzleDetailsStats: React.FunctionComponent<IPuzzleDetailStatsProps> = ({
  analyzeSolution,
}: IPuzzleDetailStatsProps) => {

  const statsOverlayRef = useRef(null);
  const overlayRef = useRef(null);
  /** Dictionary redux props */
  const dictionaryLoaded = useAppSelector(isDictionaryLoaded);
  const dictionary: IWordleDictionary = useAppSelector(getDictionary);

  const [dictionaryLetters, setDictionaryLetters] = useState<Array<number>>([]);
  /** Letters appearing in five available spots */
  const [letterSpots, setLetterSpots] = useState<ISelectedLetters>(getInitLetterSpots());
  /** Letters not to appear in possible word matches */
  const [missingLetters, setMissingLetters] = useState<Array<string>>([]);
  const [selectedCell, setSelectedCell] = useState<ISelectedLetter>({
    position: 0,
    letter: '',
    matchType: DEFAULT_MATCH_TYPE,
  });

  const { isMobile, deviceWidth, isDeviceWidthXXS, isDeviceWidthXS } = useDeviceDetect();

  /** Displays help info panel */
  // const [showInfo, setShowInfo] = useState<boolean>(false);
  const [statResult, setStatResult] = useState<string>('');
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const [possibleMatches, setPossibleMatches] = useState<Array<number>>([]);

  const [showMatchedWordsDialog, setShowMatchedWordsDialog] = useState<boolean>(false);
  const [selectedMatchType, setSelectedMatchType] = useState<string>(MATCH_TYPE_EXACT);

  const [calculate, setCalculate] = useState<boolean>(false);

  useEffect(() => {
    if (dictionaryLoaded && dictionary) {
      setDictionaryLetters(dictionary.letters as unknown as Array<number>);

      if (analyzeSolution && analyzeSolution.shouldAnalyze) {
        const spots = getInitLetterSpots().spots;
        const exactSpots = analyzeSolution.exactMatchLetter || [];
        const existSpots = analyzeSolution.existsMatchLetter || [];
        const nonExistent = analyzeSolution.nonExistentLetters || [];
        exactSpots.forEach(
          (l) => (spots[l.indexInWord] = { position: l.indexInWord, letter: l.letter, matchType: MATCH_TYPE_EXACT })
        );
        existSpots.forEach(
          (l) => (spots[l.indexInWord] = { position: l.indexInWord, letter: l.letter, matchType: MATCH_TYPE_EXISTS })
        );

        setMissingLetters(nonExistent);
        setLetterSpots({ spots: spots });
        setCalculate(true);
      }
    }
  }, [dictionaryLoaded, dictionary, analyzeSolution]);

  useEffect(() => {
    const hasPopulatedSlots = letterSpots.spots.findIndex((spot) => spot.letter !== '') !== -1;
    const hasMissingLetters = missingLetters.length > 0;
    setDisableButton(!hasPopulatedSlots && !hasMissingLetters);
  }, [letterSpots, missingLetters]);

  useEffect(() => {
    if (calculate && !disableButton) {
      doCalculateStats();
      setCalculate(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calculate, disableButton]);

  const hasSelectedLetters = () => {
    return letterSpots.spots.findIndex((spot: ISelectedLetter) => spot.letter !== '') !== -1;
  };

  const handleLetterChange = useCallback(
    (letter: string, positionNum?: number) => {
      console.log(`handling letter change: letter = (${letter}) in position ${positionNum}, and ${letterSpots.spots}`);
      const missingLetterIndex = missingLetters.indexOf(letter);
      if (missingLetterIndex !== -1) {
        const copyMissingLettersArray = [...missingLetters];
        copyMissingLettersArray.splice(missingLetterIndex, 1);
        setMissingLetters(copyMissingLettersArray);
      } else if (selectedMatchType === 'missing') {
        setMissingLetters([...missingLetters, letter]);
      } else if (positionNum !== undefined && letter === '') {
        const spots = [...letterSpots.spots];
        spots[positionNum] = { position: positionNum, letter: letter, matchType: selectedMatchType };
        setLetterSpots({ spots: [...spots] });
      } else {
        const emptySpot = letterSpots.spots.find((spot: ISelectedLetter) => spot.letter === '');
        const possibleSpot = letterSpots.spots[selectedCell.position].letter === '' ? selectedCell : emptySpot;
        const positionIndex: number = positionNum ? positionNum : possibleSpot ? possibleSpot.position : -1;
        if (positionIndex !== -1) {
          const spots = [...letterSpots.spots];
          spots[positionIndex] = { position: positionIndex, letter: letter, matchType: selectedMatchType };
          if (positionIndex !== 4) {
            setSelectedCell(spots[positionIndex + 1]);
          }
          setLetterSpots({ spots: [...spots] });
        }
      }
    },
    [letterSpots, selectedMatchType, missingLetters, selectedCell]
  );

  const onDeletePressed = (event?: Event) => {
    const kbEvent = event as KeyboardEvent;
    if (kbEvent && kbEvent.key !== 'Backspace') {
      return;
    }
    const cellIndex = selectedCell.position;
    const spotsCopy = [...letterSpots.spots];
    console.log(`onDeletePressed: cell:${cellIndex} letter: ${spotsCopy[cellIndex].letter}`);
    if (spotsCopy[cellIndex].letter !== '') {
      spotsCopy[cellIndex].letter = '';
      spotsCopy[cellIndex].matchType = MATCH_TYPE_NONE;
      // setLetterSpots({spots: spotsCopy});
    } else if (cellIndex > 0) {
      spotsCopy[cellIndex - 1].letter = '';
      spotsCopy[cellIndex - 1].matchType = MATCH_TYPE_NONE;
      setSelectedCell(spotsCopy[cellIndex - 1]);
      // setLetterSpots({spots: spotsCopy});
    } else if (cellIndex === 0) {
      spotsCopy[4].letter = '';
      spotsCopy[4].matchType = MATCH_TYPE_NONE;
      setSelectedCell(spotsCopy[4]);
    }

    setLetterSpots({ spots: spotsCopy });
  };

  const hasExactSpots = () =>
    hasSelectedLetters() && letterSpots.spots.findIndex((spot) => spot.matchType === MATCH_TYPE_EXACT) !== -1;

  const getAvailableWordIndexes = (): Array<number> => {
    let wordIndexes: Array<number> = [];
    let shouldReturnEmpty = false;

    if (dictionary) {
      if (hasExactSpots()) {
        letterSpots.spots.forEach((spot: ISelectedLetter) => {
          if (spot.letter !== '' && spot.matchType === MATCH_TYPE_EXACT) {
            const letterCode = getIndexByLetterCode(spot.letter);
            let letterIndexes = dictionary.letters[letterCode];

            letterIndexes = letterIndexes.filter(
              (wIndex: number) => dictionary.words[wIndex].charAt(spot.position) === spot.letter
            );

            if (wordIndexes.length === 0) {
              wordIndexes = letterIndexes;
            } else {
              wordIndexes = intersectionArray(wordIndexes, letterIndexes);
            }
          }
        });

        if (wordIndexes.length === 0) {
          shouldReturnEmpty = true;
        }
      }
      if (hasSelectedLetters()) {
        letterSpots.spots.forEach((spot: ISelectedLetter) => {
          if (spot.letter !== '' && spot.matchType === MATCH_TYPE_EXISTS) {
            const letterCode = getIndexByLetterCode(spot.letter);
            let letterIndexes = dictionary.letters[letterCode];
  
            letterIndexes = letterIndexes.filter(
              (wIndex: number) => dictionary.words[wIndex].charAt(spot.position) !== spot.letter
            );
  
            if (wordIndexes.length === 0) {
              wordIndexes = letterIndexes;
            } else {
              wordIndexes = intersectionArray(wordIndexes, letterIndexes);
            }
          }
        });
        
        if (wordIndexes.length === 0) {
          shouldReturnEmpty = true;
        }
      }

      if (shouldReturnEmpty) {
        return [];
      }

      if (wordIndexes.length === 0 ) {
        wordIndexes = Array.from(Array(allAvailableWords.length).keys());
      }

      wordIndexes = removeNonExistentLetterIndexes(missingLetters, wordIndexes, dictionary);
    }

    return wordIndexes;
  };

  const doCalculateStats = () => {
    if (dictionary && (hasSelectedLetters() || missingLetters.length > 0)) {
      console.log('do calculate');
      const availableWords: Array<number> = getAvailableWordIndexes();
      const wordCount: number = availableWords.length;
      setStatResult(`${wordCount} WORD${wordCount !== 1 ? 'S' : ''}`);
      setPossibleMatches(availableWords);
    }
  };

  const handleClearStats = () => {
    setMissingLetters([]);
    setLetterSpots(getInitLetterSpots());
    setStatResult('');
  };

  const renderLetterButtons = () => {
    if (!dictionaryLetters || !dictionary) {
      return null;
    }

    const stateVariant = getVariantBySelectedMatchType(selectedMatchType);
    const selectedMissingLetterVariant = 'secondary';

    const letterElements: Array<JSX.Element> = dictionaryLetters.map((liw: any, index: number) => {
      const letter: string = getLetterByIndexCode(index);
      const letterId = `letter_${letter}`;
      const isSelectedMissingLetter = missingLetters.includes(letter);
      const currentVariant = isSelectedMissingLetter ? selectedMissingLetterVariant : stateVariant;
      const currentBadgeVariant = isSelectedMissingLetter
        ? `outline-${selectedMissingLetterVariant}`
        : selectedMatchType !== 'missing'
        ? currentVariant
        : selectedMissingLetterVariant;
      return (
        <section key={`key_${letterId}`}>
          <ToggleButton
            className={styles.LetterButton}
            checked={isSelectedMissingLetter}
            variant={currentVariant}
            active={false}
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              event.stopPropagation();
              if (!isMobile) {
                event.currentTarget.blur();
                handleLetterChange(letter);
                console.log('Click event');
              }
            }}
            onTouchEnd={(event: React.TouchEvent<HTMLButtonElement>) => {
              event.stopPropagation();
              if (isMobile) {
                event.currentTarget.blur();
                handleLetterChange(letter);
                console.log('Touch event');
              }
            }}
            value={letter}
          >
            {letter}{' '}
            <Badge bg={currentBadgeVariant} className={styles.LetterCount}>
              {dictionary.letters[index].length}
            </Badge>
            <span className="visually-hidden">words</span>
          </ToggleButton>
        </section>
      );
    });
    const spacers: Array<JSX.Element> = [<div key="letter_spacer1" className={styles.Spacer}></div>];
    const actualWidth = window.document.body.getBoundingClientRect().width;
    const smallestWidths = (isDeviceWidthXXS() || isDeviceWidthXS() || actualWidth < 410);
    const biggestWidths = actualWidth > 830;
    if (smallestWidths || (isMobile && smallestWidths)) {
      spacers.push(<div key="letter_spacer2" className={styles.Spacer}></div>);
      spacers.push(<div key="letter_spacer3" className={styles.Spacer}></div>);
    } else if (biggestWidths) {
      spacers.push(<div key="letter_spacer2" className={styles.Spacer}></div>);
      spacers.push(<div key="letter_spacer3" className={styles.Spacer}></div>);
      spacers.push(<div key="letter_spacer4" className={styles.Spacer}></div>);
      spacers.push(<div key="letter_spacer5" className={styles.Spacer}></div>);
    }
    letterElements.push(...spacers);
    letterElements.push(
      <Button
        key="delete-btn"
        variant="outline-danger"
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          event.stopPropagation();
          if (!isMobile) {
            event.currentTarget.blur();
            onDeletePressed();
            console.log('Click Delete event');
          }
        }}
        onTouchEnd={(event: React.TouchEvent<HTMLButtonElement>) => {
          event.stopPropagation();
          if (isMobile) {
            event.currentTarget.blur();
            onDeletePressed();
            console.log('Touch Delete event');
          }
        }}
        className={styles.DeleteButton}
      >
        <Backspace size={18} />
      </Button>
    );

    return letterElements;
  };

  const getLetterColor = (spot: ISelectedLetter) => {
    if (spot.letter === '') {
      return 'transparent';
    }
    return spot.matchType === MATCH_TYPE_EXACT ? 'green' : 'orange';
  };

  const getCounts = (): JSX.Element => {
    const totalBadge = <Badge bg="primary">{dictionary?.words.length} WORDS</Badge>;
    return (
      <div ref={statsOverlayRef} className={styles.TotalCountStats}>
        {statResult && (
          <span className={styles.TotalLetterLabel}>
            MATCHED{' '}
            <Badge bg="success" onClick={() => setShowMatchedWordsDialog(possibleMatches.length > 0)}>
              {statResult}
            </Badge>
          </span>
        )}{' '}
        <span className={styles.TotalCountLabel}>TOTAL {totalBadge}</span>
      </div>
    );
  };
  
  const getMatchTypeLabel = (icon: JSX.Element, labelShortText: string, labelText: string): JSX.Element => {
    const lessThanLaptopWidth = deviceWidth === 's' || deviceWidth === 'm';
    if (isDeviceWidthXXS() || isDeviceWidthXS()) {
      return icon;
    } else if (isMobile || lessThanLaptopWidth) {
      return <>{labelShortText}</>;
    }
    return <>{icon}{' '}{labelText}</>;
  };

  useAddEventListener('keyup' , onDeletePressed);

  return (
    <>
      {dictionaryLoaded && (
        <div className={styles.Totals}>
          {getCounts()}
          <div ref={overlayRef} className={styles.StatsLetterContainer}>
            {letterSpots.spots.map((spot, index) => (
              <PuzzleWordleCell
                key={`key_spot_${index}`}
                cellId={index.toString()}
                color={getLetterColor(spot)}
                letter={spot.letter}
                showSelected={true}
                selected={selectedCell.position === index}
                onCellSelected={(cellId) => setSelectedCell(letterSpots.spots[cellId])}
                onLetterChange={(letter) => handleLetterChange(letter, index)}
                onDeleteKeyPressed={() => onDeletePressed()}
              />
            ))}
          </div>
          <div className={styles.MatchTypeSelectionLabel}>Match type for letters in word</div>
          <MatchTypeRadioGroup
            matchTypes={[
              {
                type: MATCH_TYPE_EXACT,
                variant: 'outline-success',
                label: getMatchTypeLabel(<FileEarmarkCheck size={20} />, 'Right spot', 'Letter is in a right spot'),
              },
              {
                type: MATCH_TYPE_EXISTS,
                variant: 'outline-warning',
                label: getMatchTypeLabel(<FileDiff size={20} />, 'Wrong spot', 'Letter is in a wrong spot'),
              },
              {
                type: MATCH_TYPE_MISSING,
                variant: 'outline-secondary',
                label: getMatchTypeLabel(<FileX size={20} />, 'Not in word', 'Letter is not in a word'),
              },
            ]}
            onChange={setSelectedMatchType}
            selectedType={selectedMatchType}
          />
        </div>
      )}
      <hr />
      <div className={styles.StatsContainer}>{dictionaryLoaded && renderLetterButtons()}</div>
      <hr />
      <div className={styles.ButtonContainer}>
        <Button size="lg" variant="secondary" onClick={handleClearStats}>
          CLEAR
        </Button>
        <section>
          <Button size="lg" disabled={disableButton} onClick={doCalculateStats}>
            CALCULATE
          </Button>
        </section>
      </div>
      <MatchedWordsDialog
        dictionary={dictionary}
        letterSpots={letterSpots}
        matchedWords={possibleMatches}
        missingLetters={missingLetters}
        showDialog={showMatchedWordsDialog}
        onCloseDialog={() => setShowMatchedWordsDialog(false)}
      />
    </>
  );
};

export default PuzzleDetailsStats;
