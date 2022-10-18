import React, { useEffect } from "react";
import { PuzzleType } from "../../app/App.types";
import { getPuzzleCards, setActivePuzzle } from "../../app/appSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks/hooks";
import PuzzleCard from "./PuzzleCard";

import styles from "./Puzzles.module.scss";

const Puzzles: React.FC = () => {
  const dispatch = useAppDispatch();

  const puzzleCards = useAppSelector(getPuzzleCards); 

  useEffect(() => {
    dispatch(setActivePuzzle(PuzzleType.NONE));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderPuzzleCards = () => (
    puzzleCards.map((cardProps) => <PuzzleCard key={cardProps.puzzleName} {...cardProps} />)
  );

  return <div className={styles.AppCardContainer}>{renderPuzzleCards()}</div>;
};

export default Puzzles;
