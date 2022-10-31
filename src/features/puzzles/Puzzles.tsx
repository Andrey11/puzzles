import React, { useEffect } from "react";
import { PUZZLES } from "../../app/App.types";
import { getPuzzleCards, setActivePuzzle } from "../../app/appSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks/hooks";
import PuzzleCard from "../../components/card/PuzzleCard";

import styles from "./Puzzles.module.scss";

const Puzzles: React.FC = () => {
  const dispatch = useAppDispatch();

  const puzzleCards = useAppSelector(getPuzzleCards); 

  useEffect(() => {
    dispatch(setActivePuzzle(PUZZLES.NONE));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderPuzzleCards = () => (
    puzzleCards.map((cardProps) => <PuzzleCard key={cardProps.puzzleName} {...cardProps} />)
  );

  return <div className={styles.PuzzlesCardContainer}>{renderPuzzleCards()}</div>;
};

export default Puzzles;
