import { ILetterModel, IWordleRow } from "../../PuzzleWordle.types";


export interface IScoreModel {
  userScore: number;
  aiScore: number;
  gameNumber: number;
}

export interface IWordleVersusUserRound {
  currentUserGuess: number;
  guessWord: IWordleRow;
  isValidWord?: boolean;
}

export interface IWordleVersusState {
  score: Array<IScoreModel>;
  currentGame: number;
  maxGames: number;
  isUserTurn: boolean;
  botWordle: string;
  userRound: IWordleVersusUserRound;
  previousUserGuesses: Array<IWordleVersusUserRound>;
  showInvalidWordAnimation?: boolean | false;
}


export interface ISolutionModel {
  currentWordIndex: number;
  availableWordIndexes: Array<number>;
  attempts: number;
  matchedLetters: Array<string>;
  existsMatchLetter: Array<ILetterModel>;
  exactMatchLetter: Array<ILetterModel>;
  nonExistentLetters: Array<string>;
  nonExistentLetterAtIndex: Array<ILetterModel>;
  usedWordIndexes: Array<number>;
  usedWords: Array<string>;
}