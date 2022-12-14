import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from 'app/store';
import { setKeyboardColors } from 'components/keyboard/puzzlesKeyboardSlice';
import {
  generateColorsForUserGuess,
  generateMatchesForUserGuess,
  isWordInDictionary,
  numberToCellKey,
  numberToRoundKey,
  numberToRowKey,
  roundKeyToNumber,
} from '../../PuzzleWordle-helpers';
import {
  setCell,
  updateWordByRowId,
  updateWordColorsByRowId,
} from '../../components/rowgroup/rowGroupSlice';

import {
  setAnimateInvalidWord,
  endWordleVersusGame,
  isMatchStarted,
} from '../wordleVersusSlice';
import { isValidWord } from '../../components/dictionary/wordleDictionarySlice';
import {
  setRobotGuessWordStatus,
  setRoundComplete,
} from '../../components/robot/robotSolutionSlice';
import { ROUND_IDS, RoundKey, IGameRoundState } from '../../PuzzleWordle.types';
import { IWordleVsGameState, GameId } from '../PuzzleWordleVersus.types';

const initialState: IWordleVsGameState = {
  wod: 'OCEAN',
  currentRound: 'ROUND_1',
  rounds: {
    ROUND_1: { roundId: ROUND_IDS.ROUND_1, guessWord: [] },
    ROUND_2: { roundId: ROUND_IDS.ROUND_2, guessWord: [] },
    ROUND_3: { roundId: ROUND_IDS.ROUND_3, guessWord: [] },
    ROUND_4: { roundId: ROUND_IDS.ROUND_4, guessWord: [] },
    ROUND_5: { roundId: ROUND_IDS.ROUND_5, guessWord: [] },
    ROUND_6: { roundId: ROUND_IDS.ROUND_6, guessWord: [] },
  },
  isUserGame: true,
  isWon: false,
  isLost: false,
  score: 0,
  gameNumber: 1,
};

// Thunk actions
export const addWord =
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

export const addLetter =
  (letter: string): AppThunk =>
  (dispatch, getState) => {
    const wvGameState: IWordleVsGameState = getCurrentGame(getState());
    const matchStarted: boolean = isMatchStarted(getState());
    const { isWon, isLost, currentRound } = wvGameState;
    const activeRound: IGameRoundState = wvGameState.rounds[currentRound];
    const guessWord = [...activeRound.guessWord];
    const initialWordLength = guessWord.length;
    if (matchStarted && guessWord.length < 5 && !isWon && !isLost) {
      guessWord.push(letter);
      const roundId = activeRound.roundId;
      const isGuessWordValid = isValidWord(getState(), guessWord);
      dispatch(
        setGuessWordByRoundId({
          roundId,
          guessWord,
          isValidWord: isGuessWordValid,
          roundKey: currentRound,
        })
      );

      // update UI
      const payloadAction = {
        rowKey: numberToRowKey(roundKeyToNumber(currentRound)),
        cellKey: numberToCellKey(initialWordLength + 1),
        letter: letter,
      };
      dispatch(setCell(payloadAction));
    }
  };

export const deleteLetter = (): AppThunk => (dispatch, getState) => {
  const wvGameState: IWordleVsGameState = getState().puzzle.wordleversusgame;
  const { isWon, isLost, currentRound } = wvGameState;
  const matchStarted: boolean = isMatchStarted(getState());
  const activeRound: IGameRoundState = wvGameState.rounds[currentRound];
  const guessWord = [...activeRound.guessWord];
  const initialWordLength = guessWord.length;

  if (matchStarted && initialWordLength > 0 && !isWon && !isLost) {
    guessWord.pop();
    const roundId = activeRound.roundId;
    dispatch(
      setGuessWordByRoundId({
        roundId,
        guessWord,
        isValidWord: false,
        roundKey: currentRound,
      })
    );

    const payloadAction = {
      rowKey: numberToRowKey(roundKeyToNumber(currentRound)),
      cellKey: numberToCellKey(initialWordLength),
      letter: '',
    };

    dispatch(setCell(payloadAction));
  }
};

export const setGuessWordValid =
  (isValid: boolean): AppThunk =>
  (dispatch, getState) => {
    const roundKey: RoundKey = getCurrentRoundKey(getState());
    dispatch(setGuessWordValidByRoundId({ roundKey, isValid }));
  };

export const onSubmitGuess = (): AppThunk => (dispatch, getState) => {
  const currentGameState: IWordleVsGameState = getCurrentGame(getState());
  const matchStarted: boolean = isMatchStarted(getState());
  const { wod, isLost, isWon } = currentGameState;
  const activeRound: IGameRoundState = getCurrentGameRoundState(getState());
  const currentRoundNumber: number = getCurrentRoundAsNumber(getState());
  const guessWord = activeRound.guessWord;
  const isValid =
    activeRound.isValidWord || isWordInDictionary(guessWord.join(''));

  if (matchStarted && !isValid) {
    dispatch(setAnimateInvalidWord(true));
  } else if (isValid && !isLost && !isWon) {
    const isMatch = wod === guessWord.join('');

    const matches = generateMatchesForUserGuess(wod.split(''), guessWord);
    const colors = generateColorsForUserGuess(matches);

    // update keyboard letters
    const updateWordLetterColorsPayload = {
      rowKey: numberToRowKey(currentRoundNumber),
      color: colors,
    };

    const { gameNumber, isUserGame } = currentGameState;

    dispatch(setKeyboardColors(guessWord, colors));
    dispatch(updateWordColorsByRowId(updateWordLetterColorsPayload));
    if (!isUserGame) {
      dispatch(
        setRobotGuessWordStatus({ word: guessWord.join(''), colors: colors })
      );
    }

    if (isMatch) {
      // ----------------------------- winning scenario -----------------------------
      const scoreWithBonus = (6 - currentRoundNumber) / 10 + 1;
      dispatch(setScore(scoreWithBonus));
      dispatch(setWonRound(true));
      dispatch(
        endWordleVersusGame({
          gameNumber: gameNumber,
          wod: wod,
          guesses: getAllGuessWords(getState()),
          isUserGame: isUserGame,
          isWon: true,
          score: scoreWithBonus,
        })
      );
      if (!isUserGame) {
        dispatch(setRoundComplete(true));
      }
    } else if (isLastRound(getState())) {
      dispatch(setScore(0));
      dispatch(setLostRound(true));
      if (!isUserGame) {
        dispatch(setRoundComplete(false));
      }
      dispatch(
        endWordleVersusGame({
          gameNumber: gameNumber,
          wod: wod,
          guesses: getAllGuessWords(getState()),
          isUserGame: isUserGame,
          isWon: false,
          score: 0,
        })
      );
    } else {
      const nextRoundNumber = currentRoundNumber + 1;
      const newRoundId: RoundKey = numberToRoundKey(nextRoundNumber);
      dispatch(setCurrentRound(newRoundId));
    }
  } else {
  }
};

type IGameRoundStateWithRoundKey = IGameRoundState & { roundKey: RoundKey };
type IsValidWordByRoundId = { roundKey: RoundKey; isValid: boolean };
type SetNewGame = { gameId: GameId; isUserGame: boolean; wod: string };
type AddWordToRoundAction = PayloadAction<IGameRoundStateWithRoundKey>;
type SetIsValidWordAction = PayloadAction<IsValidWordByRoundId>;
type SetNewGameAction = PayloadAction<SetNewGame>;

export const wordleVersusGameSlice = createSlice({
  name: 'wordleversusgame',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setWOD: (state, action: PayloadAction<string>) => {
      state.wod = action.payload;
    },
    setCurrentRound: (state: IWordleVsGameState, action: PayloadAction<RoundKey>) => {
      state.currentRound = action.payload;
    },
    setScore: (state, action: PayloadAction<number>) => {
      state.score = action.payload;
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
    setIsUserGame: (state, action: PayloadAction<boolean>) => {
      state.isUserGame = action.payload;
    },
    startGame: (state, action: SetNewGameAction) => {
      state.wod = action.payload.wod;
      state.isUserGame = action.payload.isUserGame;
      state.gameNumber = action.payload.gameId;
    },
    resetGame: () => ({ ...initialState }),
  },
});

export const {
  setWOD,
  setCurrentRound,
  setScore,
  setGuessWordByRoundId,
  setGuessWordValidByRoundId,
  setLostRound,
  setWonRound,
  setIsUserGame,
  startGame,
  resetGame,
} = wordleVersusGameSlice.actions;

export const isUserGame = (state: RootState): boolean =>
  state.puzzle.wordleversusgame.isUserGame;
export const isRobotGame = (state: RootState): boolean =>
  !state.puzzle.wordleversusgame.isUserGame;
export const isWonGame = (state: RootState): boolean =>
  state.puzzle.wordleversusgame.isWon === true;
export const isLostGame = (state: RootState): boolean =>
  state.puzzle.wordleversusgame.isLost === true;

export const getScore = (state: RootState): number =>
  state.puzzle.wordleversusgame.score;
export const getCurrentRoundKey = (state: RootState): RoundKey =>
  state.puzzle.wordleversusgame.currentRound;
export const getCurrentRoundAsNumber = (state: RootState): number =>
  roundKeyToNumber(getCurrentRoundKey(state));
export const getWOD = (state: RootState): string =>
  state.puzzle.wordleversusgame.wod;
export const getCurrentGame = (state: RootState): IWordleVsGameState =>
  state.puzzle.wordleversusgame;
export const getGameRoundStateByRoundKey = (
  state: RootState,
  roundKey: RoundKey
): IGameRoundState => state.puzzle.wordleversusgame.rounds[roundKey];
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

export default wordleVersusGameSlice.reducer;
