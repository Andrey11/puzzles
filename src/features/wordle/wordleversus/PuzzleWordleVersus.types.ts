import {
  ILetterModel,
  IWordleGameState,
  IWordleRow,
} from '../PuzzleWordle.types';

export interface IScoreModel {
  userScore: number;
  aiScore: number;
}

export interface IWordleVersusUserRound {
  currentUserGuess: number;
  guessWord: IWordleRow;
  isValidWord?: boolean;
  isWon?: boolean;
  isLost?: boolean;
}

export interface IWordleVersusState {
  score: Array<IScoreModel>;
  currentGame: number;
  maxGames: number;
  // isUserTurn: boolean;
  botWordle: string;
  userRound: IWordleVersusUserRound;
  previousUserGuesses: Array<IWordleVersusUserRound>;
  showInvalidWordAnimation?: boolean | false;
}

/*********************************/

export type GameId = number | string;

export interface IWordleVsGameState extends IWordleGameState {
  gameNumber: GameId;
  score: number;
}

export interface IFinishedGame {
  gameNumber: GameId;
  wod: string;
  guesses: Array<string>;
  isUserGame: boolean;
  isWon: boolean;
  score: number;
}

export interface IRobotControls {
  shouldRobotPickWod: boolean;
  shouldRobotSolvePuzzle: boolean;
  shouldShowRobot: boolean;
  shouldShowSelectWordOverlay: boolean;
  shouldShowStartMatchOverlay: boolean;
  shouldShowEndMatchOverlay: boolean;
}

export interface IWordleVsMatchState {
  games: Array<IFinishedGame>;
  score: IScoreModel;
  currentGame: number;
  maxGames: number;
  showInvalidWordAnimation?: boolean | false;
  matchFinished: boolean;
  matchStarted: boolean;
  isUserWinner: boolean;
}

export interface IWordleVsState extends IRobotControls, IWordleVsMatchState {
  defaultMaxGames: number;
}

export interface ISolutionModel {
  currentWordIndex: number;
  availableWordIndexes: Array<number>;
  availableWordCount: Array<number>;
  attempts: number;
  matchedLetters?: Array<ILetterModel>;
  exactMatchLetter: Array<ILetterModel>;
  existsMatchLetter: Array<ILetterModel>;
  nonExistentLetters: Array<string>;
  nonExistentLetterAtIndex: Array<ILetterModel>;
  usedWordIndexes: Array<number>;
  usedWords: Array<string>;
}
