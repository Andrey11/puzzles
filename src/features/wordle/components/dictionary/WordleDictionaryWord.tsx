import React, { ElementType, useEffect, useRef, useState } from 'react';

import { IWordDefinition } from '../../PuzzleWordle.types';
import { getWordDefinition } from './dictionaryAPI';

import Alert from 'react-bootstrap/Alert';
import Collapse from 'react-bootstrap/Collapse';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Spinner from 'react-bootstrap/Spinner';
import Tooltip from 'react-bootstrap/Tooltip';

import { BadgeCc } from 'react-bootstrap-icons';

import PhoneticAudioWord from './PhoneticAudioWord';
import styles from './WordleDictionary.module.scss';

type IWordleDictionaryWordProps = {
  word: string;
  wordId: string;
};

const WordleDictionaryWord: React.FunctionComponent<IWordleDictionaryWordProps> = ({
  word,
  wordId,
}: IWordleDictionaryWordProps) => {
  const wordRef = useRef<HTMLDivElement>(null);
  const [isOpen, setOpen] = useState<boolean>(false);
  const [definition, setDefinition] = useState<IWordDefinition>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isError, setError] = useState<boolean>(false);

  useEffect(() => {
    if (definition) {
      const hasError = definition.isError !== undefined && definition.isError === true;
      setError(hasError);
      setLoading(false);
      setOpen(!hasError);
    }
  }, [definition]);

  const updateDefinition = (wordDefinition: IWordDefinition) => {
    setDefinition(wordDefinition);
  };

  const showWordDefinition = (shouldOpen: boolean) => {
    if (!shouldOpen) {
      setOpen(false);
    } else if (isError) { 
      // do nothing
    } else if (definition) {
      setLoading(false);
      setOpen(true);
    } else {
      setLoading(true);
      getWordDefinition(word, updateDefinition);
    }
  };

  const renderWordDefinition = () => {
    return (
      <>
        <div className={styles.PhoneticCollection}>
          {definition?.phonetics.map((p, index) => (
            <PhoneticAudioWord key={`ph_${index}`} text={p.text} audio={p.audio} />
          ))}
        </div>
        <div>
          {definition?.meanings.map((m, index) => (
            <div key={`meaning_${index}`} className={styles.PartOfSpeach}>
              <span className={styles.PartOfSpeachType}>{m.partOfSpeech}</span>
              <hr />
              <ol>
                {m.definitions.map((df, index) => (
                  <li key={`meaning_def_${index}`} className={styles.Definition}>
                    <div>{df.definition}</div>
                    <div>{df.synonyms}</div>
                    <div>{df.antonyms}</div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
        <section className={styles.LicenseSection}>
          <Alert.Link href={definition?.license.url} as={'a' as ElementType} target="_blank">
            <BadgeCc size={16} title={definition?.license.name} />
          </Alert.Link>{' '}
          Definition provided by{' '}
          <Alert.Link href="https://dictionaryapi.dev/" as={'a'} target="_blank">
            dictionaryapi.dev
          </Alert.Link>
        </section>
      </>
    );
  };

  const renderWordWithErrorTooltip = () => {
    if (isError) {
      return (
        <OverlayTrigger
          key="right"
          container={wordRef.current}
          placement="auto"
          overlay={<Tooltip className={styles.WordErrorTooltip}>Unable to find the definition</Tooltip>}
        >
          <span>{word}</span>
        </OverlayTrigger>
      );
    }

    return <span>{word}</span>;
  };

  return (
    <dd className={styles.WordDefinition} id={wordId}>
      <div id={`${wordId}_anchor`} className={styles.WordDefinitionAnchor}>{' '}</div> 
      <div
        ref={wordRef}
        className={`${styles.WordDefinitionName} ${isError ? styles.WordDefinitionNameError : ''}`}
        onClick={() => showWordDefinition(!isOpen)}
        aria-controls="collapse-definition-text"
        aria-expanded={isOpen}
      >
        {renderWordWithErrorTooltip()}&nbsp;&nbsp;
        {loading && <Spinner size="sm" animation="border" variant="primary" />}
        {isOpen && definition && <span className={styles.PhoneticSpelling}>{definition?.phonetic}</span>}
      </div>
      <Collapse timeout={500} in={isOpen}>
        <div id={`word-${word}-defintion`} className={styles.WordDefinitionExpanded}>
          {!loading && definition && !definition.isError && renderWordDefinition()}
        </div>
      </Collapse>
    </dd>
  );
};

export default WordleDictionaryWord;
