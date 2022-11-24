import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../../../../app/store';
import {
  generateColorsForUserGuess,
  generateMatchesForUserGuess,
  numberToRoundKey,
  numberToRowKey,
  roundKeyToNumber,
} from '../../PuzzleWordle-helpers';
import {
  IGameRoundState,
  IWordleGameState,
  RoundKey,
  ROUND_IDS,
} from '../../PuzzleWordle.types';
import {
  setRobotGuessWordStatus,
  setRoundComplete,
} from '../robot/robotSolutionSlice';

import {
  resetRowGroup,
  updateWordByRowId,
  updateWordColorsByRowId,
} from '../rowgroup/rowGroupSlice';

export const onSubmitRobotGuess = (): AppThunk => (dispatch, getState) => {
  const currentGameState: IWordleGameState = getCurrentGame(getState());
  const { wod, isLost, isWon } = currentGameState;
  const activeRound: IGameRoundState = getCurrentGameRoundState(getState());
  const currentRoundNumber: number = getCurrentRoundAsNumber(getState());
  const guessWord = activeRound.guessWord;

  if (!isLost && !isWon) {
    const isMatch = wod === guessWord.join('');

    const matches = generateMatchesForUserGuess(wod.split(''), guessWord);
    const colors = generateColorsForUserGuess(matches);

    // update keyboard letters
    const updateWordLetterColorsPayload = {
      rowKey: numberToRowKey(currentRoundNumber),
      color: colors,
    };

    const { isUserGame } = currentGameState;

    dispatch(updateWordColorsByRowId(updateWordLetterColorsPayload));
    if (!isUserGame) {
      dispatch(
        setRobotGuessWordStatus({ word: guessWord.join(''), colors: colors })
      );
    }

    if (isMatch) {
      // ----------------------------- winning scenario -----------------------------
      dispatch(setWonRound(true));
      dispatch(setRoundComplete(true));
    } else if (isLastRound(getState())) {
      dispatch(setLostRound(true));
      dispatch(setRoundComplete(false));
    } else {
      const nextRoundNumber = currentRoundNumber + 1;
      const newRoundId: RoundKey = numberToRoundKey(nextRoundNumber);
      dispatch(setCurrentRound(newRoundId));
    }
  } else {
  }
};

// Thunk actions
export const addRobotWord =
  (word: string): AppThunk =>
  (dispatch, getState) => {
    const roundKey: RoundKey = getCurrentRoundKey(getState());
    const roundState: IGameRoundState = getCurrentGameRoundState(getState());
    const roundNum: number = getCurrentRoundAsNumber(getState());

    dispatch(
      setGuessWordByRoundId({
        roundId: roundState.roundId,
        guessWord: word.split(''),
        isValidWord: true,
        roundKey: roundKey,
      })
    );

    // update UI
    const updateWordPayload = {
      rowKey: numberToRowKey(roundNum),
      word: word.split(''),
    };
    dispatch(updateWordByRowId(updateWordPayload));
  };

export const resetWordleSolverGame = (): AppThunk => (dispatch, getState) => {
  dispatch(resetGame());
  dispatch(resetRowGroup());
};

const initialState: IWordleGameState = {
  wod: '',
  currentRound: 'ROUND_1',
  rounds: {
    ROUND_1: { roundId: ROUND_IDS.ROUND_1, guessWord: [] },
    ROUND_2: { roundId: ROUND_IDS.ROUND_2, guessWord: [] },
    ROUND_3: { roundId: ROUND_IDS.ROUND_3, guessWord: [] },
    ROUND_4: { roundId: ROUND_IDS.ROUND_4, guessWord: [] },
    ROUND_5: { roundId: ROUND_IDS.ROUND_5, guessWord: [] },
    ROUND_6: { roundId: ROUND_IDS.ROUND_6, guessWord: [] },
  },
  isUserGame: false,
  isWon: false,
  isLost: false,
};

type IGameRoundStateWithRoundKey = IGameRoundState & { roundKey: RoundKey };
type IsValidWordByRoundId = { roundKey: RoundKey; isValid: boolean };
type AddWordToRoundAction = PayloadAction<IGameRoundStateWithRoundKey>;
type SetIsValidWordAction = PayloadAction<IsValidWordByRoundId>;

export const wordleSolverSlice = createSlice({
  name: 'wordlesolver',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setWOD: (state, action: PayloadAction<string>) => {
      state.wod = action.payload;
    },
    setCurrentRound: (state, action: PayloadAction<RoundKey>) => {
      state.currentRound = action.payload;
    },
    setGuessWordByRoundId: (state, action: AddWordToRoundAction) => {
      const { roundKey } = action.payload;
      state.rounds[roundKey] = { ...action.payload }; //{roundId, guessWord, isValidWord};
    },
    setGuessWordValidByRoundId: (state, action: SetIsValidWordAction) => {
      const { roundKey, isValid } = action.payload;
      state.rounds[roundKey].isValidWord = isValid;
    },
    setWonRound: (state, action: PayloadAction<boolean>) => {
      state.isWon = action.payload;
    },
    setLostRound: (state, action: PayloadAction<boolean>) => {
      state.isLost = action.payload;
    },
    // startGame: (state, action: SetNewGameAction) => {
    //   state.wod = action.payload.wod;
    //   state.isUserGame = action.payload.isUserGame;
    //   state.gameNumber = action.payload.gameId;
    // },
    resetGame: () => {
      return initialState;
    },
  },
});

export const {
  setWOD,
  setCurrentRound,
  setGuessWordByRoundId,
  setGuessWordValidByRoundId,
  setWonRound,
  setLostRound,
  resetGame,
} = wordleSolverSlice.actions;

export const isWonGame = (state: RootState): boolean =>
  state.puzzle.wordlesolver.isWon === true;
export const isLostGame = (state: RootState): boolean =>
  state.puzzle.wordlesolver.isLost === true;

export const getCurrentRoundKey = (state: RootState): RoundKey =>
  state.puzzle.wordlesolver.currentRound;
export const getCurrentRoundAsNumber = (state: RootState): number =>
  roundKeyToNumber(getCurrentRoundKey(state));
export const getWOD = (state: RootState): string =>
  state.puzzle.wordlesolver.wod;
export const getCurrentGame = (state: RootState): IWordleGameState =>
  state.puzzle.wordlesolver;
export const getGameRoundStateByRoundKey = (
  state: RootState,
  roundKey: RoundKey
): IGameRoundState => state.puzzle.wordlesolver.rounds[roundKey];
export const getCurrentGameRoundState = (state: RootState): IGameRoundState =>
  getGameRoundStateByRoundKey(state, getCurrentRoundKey(state));
export const isLastRound = (state: RootState): boolean =>
  getCurrentRoundAsNumber(state) === ROUND_IDS.ROUND_6;
export const getAllGuessWords = (state: RootState): Array<string> => {
  const rounds: Record<RoundKey, IGameRoundState> =
    getCurrentGame(state).rounds;
  return Object.keys(rounds)
    .map((rd: string) => rounds[rd as RoundKey].guessWord.join(''))
    .filter((word: string) => word.length === 0);
};
export const shouldRobotSolvePuzzle = (state: RootState) =>
  !isLostGame(state) && !isWonGame(state) && getWOD(state).length > 0;

export default wordleSolverSlice.reducer;
