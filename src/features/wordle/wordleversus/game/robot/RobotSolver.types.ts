import { ISolutionModel } from "../../PuzzleWordleVersus.types";

export type TRobotStatus =
  | 'idle'
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
}