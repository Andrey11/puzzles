export enum PuzzleType {
  WORDLE = 'wordle',
  NONE = 'none',
  WORDLE_VERSUS = 'wordleversus',
};

export declare type AppStatus = 'idle' | 'loading' | 'failed';

export interface IPuzzleCardProps {
  puzzleName: PuzzleType.WORDLE | PuzzleType.WORDLE_VERSUS;
  codeUrl: string;
  navigateUrl: string;
  puzzleImageUrl: string;
  puzzleDescription: string;
}

export interface IAppState {
  activePuzzle: PuzzleType;
  status: AppStatus;
  puzzleCardProps: Array<IPuzzleCardProps>;
}

