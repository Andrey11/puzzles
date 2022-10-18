import React from 'react';
import Modal from 'react-bootstrap/Modal';

import {
  IWordleDictionary,
  ISelectedLetters,
  ISelectedLetter,
  MATCH_TYPE_EXISTS,
  MATCH_TYPE_EXACT,
} from '../../../PuzzleWordle.types';

import styles from '../PuzzleDetailsStats.module.scss';

export type MatchedWordsDialogProps = {
  dictionary?: IWordleDictionary;
  matchedWords: Array<number>;
  missingLetters: Array<string>;
  letterSpots: ISelectedLetters;
  showDialog: boolean;
  onCloseDialog: () => void;
};

const NON_BREAKING_SPACE = <>&nbsp;</>;

const MatchedWordsDialog: React.FunctionComponent<MatchedWordsDialogProps> = ({
  dictionary,
  matchedWords,
  missingLetters,
  letterSpots,
  showDialog,
  onCloseDialog,
}: MatchedWordsDialogProps) => {
  const getExistsInWord = (): Array<ISelectedLetter> => {
    return letterSpots.spots.filter((spot: ISelectedLetter) => spot.matchType === MATCH_TYPE_EXISTS);
  };

  const getWordsByIndexes = () => {
    const existsMatches = getExistsInWord();

    const getLetterCls = (matchedWord: string) => {
      const cellStyle = styles.CellLetter;

      let letterClasses: Array<string> = [];
      letterClasses = matchedWord.split('').map((letter: string, index: number) => {
        return letterSpots.spots[index].letter === letter && letterSpots.spots[index].matchType === MATCH_TYPE_EXACT
          ? `${cellStyle} ${styles.ExactMatch}`
          : existsMatches.filter(
              (spot: ISelectedLetter) =>
                spot.letter === letter && spot.matchType === MATCH_TYPE_EXISTS && spot.position !== index
            ).length > 0
          ? `${cellStyle} ${styles.Match}`
          : cellStyle;
      });

      return letterClasses;
    };

    const matches = matchedWords.map((wordIndex: number) => dictionary?.words[wordIndex] || '     ');
    matches.sort();

    return matches.map((matchedWord: string, wordIndex: number) => {
      const letterClasses = getLetterCls(matchedWord);

      return (
        <div key={`word-key-${wordIndex}`}>
          <span className={letterClasses[0]}>{matchedWord.charAt(0)}</span>
          <span className={letterClasses[1]}>{matchedWord.charAt(1)}</span>
          <span className={letterClasses[2]}>{matchedWord.charAt(2)}</span>
          <span className={letterClasses[3]}>{matchedWord.charAt(3)}</span>
          <span className={letterClasses[4]}>{matchedWord.charAt(4)}</span>
        </div>
      );
    });
  };

  return (
    <>
      <Modal
        className={styles.ModalStats}
        size="sm"
        centered
        scrollable
        show={showDialog}
        onHide={() => onCloseDialog()}
      >
        <Modal.Header closeButton>
          <Modal.Title as={'h5'}>
            <div>{`${matchedWords.length} Matched Word${matchedWords.length !== 1 ? 's' : ''}`}</div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={styles.ModalWordList}>{getWordsByIndexes()}</div>
        </Modal.Body>
        <Modal.Footer className={styles.ModelFooterAlignCenter}>
          <div className={styles.ModalWordList}>
            {letterSpots.spots.map((spot) => {
              const hasLetter = spot.letter !== '';
              const letter = spot.letter || NON_BREAKING_SPACE;
              const letterCls =
                hasLetter && spot.matchType === MATCH_TYPE_EXACT
                  ? `${styles.CellLetter} ${styles.ExactMatch}`
                  : hasLetter && spot.matchType === MATCH_TYPE_EXISTS
                  ? `${styles.CellLetter} ${styles.Match}`
                  : styles.CellLetter;
              return (
                <span key={`key_${spot.position}_${letter}`} className={letterCls}>
                  {letter}
                </span>
              );
            })}
          </div>
          <div className={styles.MissedLetters}>
            {missingLetters.map((l) => (
              <span key={`key_${l}`} className={`${styles.CellLetter} ${styles.Miss}`}>
                {l}
              </span>
            ))}
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MatchedWordsDialog;
