import React, { useState } from 'react';
import { Search, Book } from 'react-bootstrap-icons';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Offcanvas from 'react-bootstrap/Offcanvas';
import AlphabetScrollList from '../alphabetscroll/AlphabetScrollList';
import WordSelector from '../dropdown/WordSelector';

import styles from './WordleDictionary.module.scss';
import { useAppSelector } from '../../../../app/hooks/hooks';
import { getSelectableWords, isDictionaryLoaded } from './wordleDictionarySlice';

const WordleDictionaryOffcanvas: React.FC = () => {
  const [show, setShow] = useState<boolean>(false);
  const [wordSelected, setWordSelected] = useState<string>('');
  const [firstPaintDone, setFirstPaintDone] = useState<boolean>(false);

  const handleClose = () => {
    setShow(false);
    setFirstPaintDone(false);
  };

  const handleShow = () => setShow(true);

  const handleSearchComponentLoaded = () => {
    setTimeout(() => {
      setFirstPaintDone(true);
    }, 500);
  };

  const dictionaryLoaded = useAppSelector(isDictionaryLoaded);
  const selectableWords = useAppSelector(getSelectableWords);

  const renderDictionaryContainer = () => {
    if (dictionaryLoaded && firstPaintDone) {
      return (
        <div className={styles.PuzzleDictionary}>
          <div className={styles.PuzzleDictionaryScrollListWrapper}>
            <AlphabetScrollList searchWord={wordSelected} />
          </div>
        </div>
      );
    }
    return (
      <div className={styles.SpinnerDisplay}>
        <Spinner variant="primary" animation={'border'} />
      </div>
    );
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        <Book size={24} />
      </Button>

      <Offcanvas
        id="DictionaryOffcanvas"
        className={styles.DictionaryOffcanvasDisplay}
        show={show}
        onHide={handleClose}
        placement="bottom"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <div className={styles.WordSearchRow}>
              <Search className={styles.WordSearchRowIcon} size={24} />
              <WordSelector
                words={selectableWords}
                autoFocus={true}
                onWordSelected={setWordSelected}
                onFocus={handleSearchComponentLoaded}
                placeholder={
                  <span className={styles.PlaceholderMessage}>Search</span>
                }
              />
            </div>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>{renderDictionaryContainer()}</Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default WordleDictionaryOffcanvas;
