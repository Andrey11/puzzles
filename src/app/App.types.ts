import { IHeaderItem, ItemAction } from 'components/header/PuzzleHeader';

export enum PuzzleType {
  NONE = 'none',
  LOBBY = 'lobby',
  WORDLE = 'wordle',
  WORDLE_VERSUS = 'wordleversus',
}

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
  headerItems?: Array<IHeaderItem>;
  headerTitle?: string;
  headerItemAction?: ItemAction;
  showHeaderDictionaryIcon?: boolean;
}
