import { ILetterModel, IWordleRow } from "../PuzzleWordle.types";

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

export enum ROUND_IDS {
  ROUND_1 = 1,
  ROUND_2,
  ROUND_3,
  ROUND_4,
  ROUND_5,
  ROUND_6,
}

export type RoundKey = keyof typeof ROUND_IDS;

export interface IGameRoundState {
  roundId: ROUND_IDS;
  guessWord: Array<string>;
  isValidWord?: boolean;
}

export type GameId = number | string;

export interface IGameState {
  gameNumber: GameId;
  wod: string;
  currentRound: RoundKey;
  rounds: Record<RoundKey, IGameRoundState>;
  isUserGame: boolean;
  isWon?: boolean;
  isLost?: boolean;
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

export interface IWordleVsState {
  games: Array<IFinishedGame>;
  score: IScoreModel;
  currentGame: number;
  maxGames: number;
  showInvalidWordAnimation?: boolean | false;
  defaultMaxGames: number;
  matchFinished: boolean;
  shouldRobotPickWod: boolean;
  shouldRobotSolvePuzzle: boolean;
}



export interface ISolutionModel {
  currentWordIndex: number;
  availableWordIndexes: Array<number>;
  attempts: number;
  matchedLetters: Array<ILetterModel>;
  existsMatchLetter: Array<ILetterModel>;
  exactMatchLetter: Array<ILetterModel>;
  nonExistentLetters: Array<string>;
  nonExistentLetterAtIndex: Array<ILetterModel>;
  usedWordIndexes: Array<number>;
  usedWords: Array<string>;
}