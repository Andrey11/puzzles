import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from 'app/hooks/hooks';
import { Search, BookHalf } from 'react-bootstrap-icons';
import Offcanvas from 'react-bootstrap/Offcanvas';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Spinner from 'react-bootstrap/Spinner';
import Tooltip from 'react-bootstrap/Tooltip';
import AlphabetScrollList from '../alphabetscroll/AlphabetScrollList';
import WordSelector from '../dropdown/WordSelector';
import { setActiveLetter } from './uiDictionarySlice';
import { getSelectableWords, isDictionaryLoaded } from './wordleDictionarySlice';

import styles from './WordleDictionary.module.scss';

const WordleDictionaryOffcanvas: React.FC = () => {
  const [show, setShow] = useState<boolean>(false);
  const [wordSelected, setWordSelected] = useState<string>('');
  const [firstPaintDone, setFirstPaintDone] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const handleClose = () => {
    setShow(false);
    setFirstPaintDone(false);
    dispatch(setActiveLetter('A'));
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
      <OverlayTrigger
        placement="auto"
        overlay={
          <Tooltip className={styles.DictionaryTooltip} id="tooltip-dictionary">
            Open Dictionary
          </Tooltip>
        }
      >
        <span className="d-inline-block">
          <BookHalf onClick={handleShow} className={styles.DictionaryIcon} />
        </span>
      </OverlayTrigger>

      <Offcanvas
        id={styles['DictionaryOffcanvas']}
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
                placeholder={<span>Search</span>}
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
