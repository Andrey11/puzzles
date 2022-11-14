import React, { ReactElement } from 'react';
import Image from 'react-bootstrap/Image';
import ProgressBar from 'react-bootstrap/ProgressBar';

import styles from './PuzzleLoader.module.scss';

type PuzzleLoaderProps = {
  imageUrl?: string;
  puzzleName?: string;
  customEl?: ReactElement | JSX.Element;
  variant?: string;
};

const PuzzleLoader: React.FC<PuzzleLoaderProps> = ({ ...props }) => {
  return (
    <div className={styles.PuzzleLoaderContainer}>
      <Image
        src={props.imageUrl}
        alt={props.puzzleName}
        title={props.puzzleName}
      />
      {props.customEl}
      <ProgressBar
        className={styles.LoaderBar}
        variant={props.variant || 'success'}
        animated
        now={100}
        label="Loading..."
      />
    </div>
  );
};

const PuzzlesLoader: React.FC = () => {
  return (
    <PuzzleLoader imageUrl="/images/puzzles-loader.png" puzzleName="Puzzles" />
  );
};

const WordleVersusLoader: React.FC = () => {
  return (
    <PuzzleLoader
      imageUrl="/images/wordleversus-loader.png"
      puzzleName="Wordle Versus"
    />
  );
};

const WordleSolverLoader: React.FC = () => {
  return (
    <PuzzleLoader
      imageUrl="/images/wordlesolver-loader.png"
      puzzleName="Wordle Solver"
    />
  );
};

export {
  PuzzleLoader as default,
  WordleVersusLoader,
  WordleSolverLoader,
  PuzzlesLoader,
};
