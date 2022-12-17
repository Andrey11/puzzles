import { AppThunk } from "../../../../app/store";
import { ISolutionModel } from "../../wordleversus/PuzzleWordleVersus.types";

export type RobotHeadSwipeDirection = 'none' | 'up' | 'down' | 'show';

export type TRobotStatus =
  | 'idle'
  | 'robot-picking-word'
  | 'calculate-robot-guess'
  | 'submit-robot-guess'
  | 'analyze-robot-guess-result'
  | 'end-solving'
  | 'error';

export interface IWordleSolution extends ISolutionModel {
  isFound: boolean;
  isCompleted: boolean;
  displayColors: Array<string>;
  statInfoTracker: string;
}

export interface IWordStatus {
  word: string;
  colors: Array<string>;
}

export interface IRobotSolution extends IWordleSolution {
  guessWords: Array<string>;
  guessWordsStatus: Array<IWordStatus>;
  robotStatus: TRobotStatus; 
  startingWord?: string;
}

export type OnRobotPickedWord = (word: string) => AppThunk<void>;
export type OnSubmitRobotWord = () => AppThunk<void>;