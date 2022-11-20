import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../../../app/store';
import { resetKeyboard } from '../../../components/keyboard/puzzlesKeyboardSlice';
import { resetRowGroup } from '../components/rowgroup/rowGroupSlice';

import {
  IFinishedGame,
  IGameState,
  IScoreModel,
  IWordleVsState,
} from './PuzzleWordleVersus.types';
import { resetGame, startGame } from './game/wordleVersusGameSlice';

export const resetPuzzleState = (): AppThunk => (dispatch, _getState) => {
  // const wordleVersusState = getState().puzzle.wordleversus;
  // const keyboardState = getState().puzzle.keyboard;
  dispatch(resetRowGroup());
  dispatch(resetKeyboard());
  dispatch(resetGame());
};

export const endWordleVersusGame =
  (finishedGame: IFinishedGame): AppThunk =>
  (dispatch, getState) => {
    const wvState: IWordleVsState = getState().puzzle.wordleversus;
    const { currentGame, maxGames } = wvState;
    // update score
    const { userScore, aiScore } = wvState.score;
    const uScore =
      userScore + (finishedGame.isUserGame ? finishedGame.score : 0);
    const cpuScore =
      aiScore + (finishedGame.isUserGame ? 0 : finishedGame.score);
    const scoreModel = { userScore: uScore, aiScore: cpuScore };

    dispatch(addScore(scoreModel));
    dispatch(setFinishedGame(finishedGame));
    if (currentGame === maxGames) {
      dispatch(setMatchFinished());
    }
  };

export const startWordleVersusMatch = (): AppThunk => (dispatch, getState) => {
  const wvState: IWordleVsState = getState().puzzle.wordleversus;
  dispatch(resetRowGroup());
  dispatch(resetKeyboard());
  dispatch(createMatch(wvState.maxGames || wvState.defaultMaxGames));
};

export const startWordleVersusNextGame =
  (wod: string): AppThunk =>
  (dispatch, getState) => {
    const wvState: IWordleVsState = getState().puzzle.wordleversus;
    const wvgState: IGameState = getState().puzzle.wordleversusgame;
    const { currentGame } = wvState;
    const { isUserGame } = wvgState;
    dispatch(startWordleVersusGame(currentGame + 1, !isUserGame, wod));
  };

export const startWordleVersusGame =
  (gameId: number, isUserGame: boolean, wod: string): AppThunk =>
  (dispatch, getState) => {
    const wvState: IWordleVsState = getState().puzzle.wordleversus;
    const { maxGames } = wvState;
    if (gameId <= maxGames) {
      dispatch(setCurrentGame(gameId));
      dispatch(resetGame());
      dispatch(resetRowGroup());
      dispatch(resetKeyboard());
      dispatch(startGame({ gameId: gameId, isUserGame: isUserGame, wod: wod }));
      if (!isUserGame) {
        dispatch(setShouldRobotSolvePuzzle(true));
      }
    } else {
      // match is over
      // do something when match is over
      console.log('Match finished, should ask to start a new match');
    }
  };

export const robotPickedWod =
  (wod: string): AppThunk =>
  (dispatch, getState) => {
    const wvState: IWordleVsState = getState().puzzle.wordleversus;
    const { currentGame } = wvState;
    dispatch(setShouldPickWod(false));
    dispatch(startWordleVersusGame(currentGame + 1, true, wod));
  };

const initialState: IWordleVsState = {
  maxGames: 2,
  defaultMaxGames: 2,
  currentGame: 0,
  score: {
    userScore: 0,
    aiScore: 0,
  },
  showInvalidWordAnimation: false,
  shouldRobotPickWod: false,
  shouldRobotSolvePuzzle: false,
  games: [],
  matchFinished: false,
  matchStarted: false,
  isUserWinner: false,
};

export const wordleVersusSlice = createSlice({
  name: 'wordleversus',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    createMatch: (state, action: PayloadAction<number>) => {
      state.maxGames = action.payload;
      state.score = { userScore: 0, aiScore: 0 };
      state.showInvalidWordAnimation = false;
      state.games = [];
      state.matchFinished = false;
      state.matchStarted = true;
      state.currentGame = 0;
      state.isUserWinner = false;
    },
    setMaxGames: (state, action: PayloadAction<number>) => {
      state.maxGames = action.payload;
    },
    setCurrentGame: (state, action: PayloadAction<number>) => {
      state.currentGame = action.payload;
    },
    addScore: (state, action: PayloadAction<IScoreModel>) => {
      state.score = action.payload;
    },
    setFinishedGame: (state, action: PayloadAction<IFinishedGame>) => {
      state.games.push(action.payload);
    },
    setAnimateInvalidWord: (state, action: PayloadAction<boolean>) => {
      state.showInvalidWordAnimation = action.payload;
    },
    setMatchFinished: (state) => {
      state.matchFinished = true;
      state.matchStarted = false;
      state.shouldRobotSolvePuzzle = false;
      state.isUserWinner = state.score.userScore > state.score.aiScore;
    },
    setMatchStarted: (state, action: PayloadAction<boolean>) => {
      state.matchStarted = action.payload;
    },
    setShouldPickWod: (state, action: PayloadAction<boolean>) => {
      state.shouldRobotPickWod = action.payload;
    },
    setShouldRobotSolvePuzzle: (state, action: PayloadAction<boolean>) => {
      state.shouldRobotSolvePuzzle = action.payload;
    },
  },
});

export const {
  createMatch,
  setMaxGames,
  setCurrentGame,
  addScore,
  setFinishedGame,
  setMatchFinished,
  setAnimateInvalidWord,
  setShouldPickWod,
  setShouldRobotSolvePuzzle,
} = wordleVersusSlice.actions;

export const getCurrentGame = (state: RootState) =>
  state.puzzle.wordleversus.currentGame;
export const getMaxGames = (state: RootState) =>
  state.puzzle.wordleversus.maxGames;
export const getScore = (state: RootState) => state.puzzle.wordleversus.score;
export const showInvalidWordAnimation = (state: RootState): boolean =>
  state.puzzle.wordleversus.showInvalidWordAnimation === true;
export const getFinishedGames = (state: RootState) =>
  state.puzzle.wordleversus.games;
export const isMatchFinished = (state: RootState) =>
  state.puzzle.wordleversus.matchFinished;
export const isMatchStarted = (state: RootState) =>
  state.puzzle.wordleversus.matchStarted;
export const isUserWinner = (state: RootState) =>
  state.puzzle.wordleversus.isUserWinner;
export const shouldRobotPickWod = (state: RootState) =>
  state.puzzle.wordleversus.shouldRobotPickWod;
export const shouldRobotSolvePuzzle = (state: RootState) =>
  state.puzzle.wordleversus.shouldRobotSolvePuzzle;

export default wordleVersusSlice.reducer;
