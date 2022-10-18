import React, { useEffect } from "react";
import Card from "react-bootstrap/Card";
import { NavigateFunction, useNavigate } from "react-router-dom";
import styles from "./Puzzles.module.scss";
import { IPuzzleCardProps, PuzzleType } from "../../app/App.types";
import { setActivePuzzle } from "../../app/appSlice";
import { useAppDispatch } from "../../app/hooks/hooks";
import { CodeSquare, Heart, HeartFill, Robot } from "react-bootstrap-icons";
import { useState } from "react";
import Button from "react-bootstrap/Button";


const PuzzleCard: React.FC<IPuzzleCardProps> = ({
  codeUrl,
  navigateUrl,
  puzzleDescription,
  puzzleImageUrl,
}: IPuzzleCardProps) => {
  const navigate: NavigateFunction = useNavigate();
  const dispatch = useAppDispatch();

  const [isLiked, setLiked] = useState<boolean>(false);
  
  useEffect(() => {
    dispatch(setActivePuzzle(PuzzleType.NONE));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ViewCodeIcon = () => (
    <a
      href={codeUrl}
      target="_blank"
      rel="noreferrer"
    >
      <CodeSquare />
    </a>
  );

  const LikeAppIcon = () => {
    return isLiked ? (
      <HeartFill onClick={() => setLiked(false)} />
    ) : (
      <Heart onClick={() => setLiked(true)} />
    );
  };

  const robotIndex = puzzleDescription.indexOf('{R}');

  return (
    <Card
      bg="light"
      text="secondary"
      style={{ width: "18rem" }}
      className={`${styles.CardWrapper} mb-2 shadow`}
    >
      <Card.Img
        onClick={() => navigate(navigateUrl)}
        variant="top"
        src={puzzleImageUrl}
      />
      <Card.Body className={styles.CardBodyWrapper}>
        <Card.Text className={styles.CardTextStyle}>
          {puzzleDescription.slice(0, robotIndex)}
           <Robot alignmentBaseline="middle" />
          {puzzleDescription.slice(robotIndex+3)}
        </Card.Text>
      </Card.Body>
      <Card.Footer className={styles.CardFooter}>
        <Button size="sm" onClick={() => navigate(navigateUrl)}>
          OPEN
        </Button>
        <section className={styles.IconsWrapper}>
          <LikeAppIcon />
          <ViewCodeIcon />
        </section>
      </Card.Footer>
    </Card>
  );
};

export default PuzzleCard;
