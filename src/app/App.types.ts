export enum PUZZLES {
  NONE = 'none',
  WORDLE = 'wordle',
  WORDLE_VERSUS = 'wordleversus',
};

export declare type AppStatus = 'idle' | 'loading' | 'failed';

export interface IPuzzleCardProps {
  puzzleName: PUZZLES.WORDLE | PUZZLES.WORDLE_VERSUS;
  codeUrl: string;
  navigateUrl: string;
  puzzleImageUrl: string;
  puzzleDescription: string;
}

export interface IAppState {
  activePuzzle: PUZZLES;
  status: AppStatus;
  puzzleCardProps: Array<IPuzzleCardProps>;
}

