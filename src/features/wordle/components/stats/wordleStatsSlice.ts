import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from 'app/store';
import { cellKeyToPositionInWord, positionInWordToCellKey, removeIntersectingItems } from '../../PuzzleWordle-helpers';
import {
  clearCellByRowIdAndCellId,
  resetCellsByRowId,
  setCellProps,
  setCellSelectedByRowAndCellId,
} from '../rowgroup/rowGroupSlice';

import { ILetterModel, IMatchType, OMatchType } from '../../PuzzleWordle.types';

import { CellKey, RowKey } from '../rowgroup/RowGroup.types';
import { IWordStatus, TRobotStatus } from '../robot/RobotSolver.types';
import {
  getKeyboardColor,
  setKeyboardColor,
  updateLetters as updateKeyboardLetters,
} from 'components/keyboard/puzzlesKeyboardSlice';
import { ILetterKey, KeyboardColor, KeyboardLetter, KEYBOARD_COLORS } from 'components/keyboard/PuzzlesKeyboard.types';
import { caclulateAvailableIndexes } from '../robot/robotSolutionSlice';
import { getDictionary } from '../dictionary/wordleDictionarySlice';
import { allAvailableWords } from 'features/wordle/PuzzleWords';

// Stats only uses 1 row, so no need to figure out what is a current row
const rowKey: RowKey = 'ROW_1' as RowKey;

const getKeyboardLetters = (letters: Array<ILetterModel>, color: KEYBOARD_COLORS): Array<ILetterKey> => {
  return letters.map((lm: ILetterModel) => ({
    letter: lm.letter as KeyboardLetter,
    letterColor: color,
    checked: true,
  }));
};

const getKeyboardColorByMatchType = (type: string): KeyboardColor => {
  return type === 'exact'
    ? KEYBOARD_COLORS.GREEN_OUTLINE
    : type === 'exists'
    ? KEYBOARD_COLORS.ORANGE_OUTLINE
    : KEYBOARD_COLORS.GREY_OUTLINE;
};

export interface ISelectedLetter extends ILetterModel {
  matchType: string; // OMatchType
}

type TResultGuessWords = {
  guessWords: Array<string>;
  guessWordsIndexes: Array<number>;
};

interface IWordleStatsState {
  matchType: IMatchType;
  selectedCell: CellKey;
  selectedLetters: Array<ISelectedLetter>;
  isCompleted: boolean;
  guessWords: Array<string>;
  guessWordsIndexes: Array<number>;
  guessWordsStatus: Array<IWordStatus>;
  robotStatus: TRobotStatus;
}

const initialState: IWordleStatsState = {
  matchType: { type: OMatchType.EXACT, variant: 'outline-success', label: 'Exact match' },
  selectedCell: 'CELL_1' as CellKey,
  selectedLetters: [],
  isCompleted: false,
  guessWords: [],
  guessWordsIndexes: [],
  guessWordsStatus: [],
  robotStatus: 'idle',
};

export const onStatsScreenActivated = (): AppThunk => (dispatch, getState) => {
  const currentSelectedCell: CellKey = getSelectedCell(getState());
  const matchType: IMatchType = getSelectedMatchType(getState());
  const rowUIActionFalse = { rowKey, cellKey: currentSelectedCell, selected: true };
  dispatch(setCellSelectedByRowAndCellId(rowUIActionFalse));
  dispatch(setKeyboardColor(getKeyboardColorByMatchType(matchType.type)));
};

export const onMatchTypeChange =
  (matchType: IMatchType): AppThunk =>
  (dispatch, getState) => {
    let letterArray: Array<ILetterKey> = getAllSelectedLettersAsLetterKeys(getState());
    dispatch(setSelectedMatchType(matchType));
    // update keyboard color and update colors of previously selected letters
    dispatch(setKeyboardColor(getKeyboardColorByMatchType(matchType.type)));
    // TODO: Do we need to do this?
    dispatch(updateKeyboardLetters(letterArray));
  };

export const onCalculateStatsAction = (): AppThunk => (dispatch, getState) => {
  const dictionary = getDictionary(getState());
  const exactMatchLetter = getExactLetters(getState());
  const existsMatchLetter = getExistLetters(getState());
  const nonExistentLetters = getMissingLetters(getState());

  const guessWordsIndexes: Array<number> = caclulateAvailableIndexes({
    availableWordIndexes: Array.from(Array(allAvailableWords.length).keys()),
    exactMatchLetter: exactMatchLetter,
    existsMatchLetter: existsMatchLetter,
    nonExistentLetters: nonExistentLetters,
    nonExistentLetterAtIndex: [],
    dictionary: dictionary,
  });

  const guessWords: Array<string> = guessWordsIndexes.map((wordIndex) => dictionary.words[wordIndex]);
  const guessResult: TResultGuessWords = {
    guessWords: guessWords,
    guessWordsIndexes: guessWordsIndexes,
  };

  dispatch(setGuessResults(guessResult));
};

export const onDeleteAction = (): AppThunk => (dispatch, getState) => {
  // test
  const cellKey: CellKey = getSelectedCell(getState());
  const positionInWord: number = cellKeyToPositionInWord(cellKey);
  const selectedLetters = getSelectedLetters(getState());
  const kbColor: KeyboardColor = getKeyboardColor(getState());

  const letterIndex = selectedLetters.findIndex(
    (letter) => letter.matchType !== OMatchType.MISSING && letter.indexInWord === positionInWord
  );

  if (letterIndex !== -1) {
    // TODO: Delete letter
    const letterToDelete = selectedLetters[letterIndex];
    const rowUIAction = { rowKey, cellKey };
    let keyboardUIAction: ILetterKey = {
      letter: letterToDelete.letter as KeyboardLetter,
      letterColor: kbColor,
      checked: false,
    };
    if (letterToDelete.matchType === OMatchType.EXACT) {
      dispatch(removeExactMatchLetter(letterToDelete));
    } else {
      dispatch(removeExistsMatchLetter(letterToDelete));
    }
    dispatch(clearCellByRowIdAndCellId(rowUIAction));
    dispatch(updateKeyboardLetters([keyboardUIAction]));
  } else if (positionInWord > 0) {
    const prevCellKey = positionInWordToCellKey(positionInWord - 1);
    dispatch(updateSelectedCell(prevCellKey));
  }
};

export const updateLetter =
  (letter: string): AppThunk =>
  (dispatch, getState) => {
    const cellKey: CellKey = getSelectedCell(getState());
    const kbColor: KeyboardColor = getKeyboardColor(getState());

    let keyboardUIAction: ILetterKey = {
      letter: letter as KeyboardLetter,
      letterColor: 'GREY_OUTLINE',
      checked: false,
    };

    const matchLetter: ILetterModel = {
      letter: letter,
      indexInWord: cellKeyToPositionInWord(cellKey),
    };

    const matchType: IMatchType = getSelectedMatchType(getState());
    const isMissingMatchType = matchType.type === OMatchType.MISSING;
    const isExistsMatchType = matchType.type === OMatchType.EXISTS;

    const missingLetters = getMissingLetters(getState());
    const isLetterInMissingList = missingLetters.indexOf(letter) !== -1;

    const isInSelectedList = isLetterInSelectedLetterList(getState(), letter);

    if (isInSelectedList) {
    } else {
    }

    // const emptyCells = getAllEmptyCells(getState());
    // const isCurrentCellEmpty = !emptyCells.includes(cellKey);

    if (isLetterInMissingList) {
      dispatch(removeMissingLetter({ ...matchLetter, indexInWord: -1 }));
      keyboardUIAction.letterColor = kbColor;
      keyboardUIAction.checked = false;
    } else if (isMissingMatchType) {
      const matchedLetterList = getLetterOccurencesInSelectedLetterList(getState(), letter);
      matchedLetterList.forEach((ml) => {
        const rowCellUIAction = {
          rowKey,
          cellKey: positionInWordToCellKey(ml.indexInWord),
          letter: '',
          color: KEYBOARD_COLORS.GREY_OUTLINE,
        };
        dispatch(setCellProps(rowCellUIAction));
        dispatch(removeMatchLetter(ml));
      });
      dispatch(addMissingLetter({ ...matchLetter, indexInWord: -1 }));
      keyboardUIAction.letterColor = KEYBOARD_COLORS.GREY;
      keyboardUIAction.checked = true;
    } else {
      const letterAtIndex = getLetterAtIndexInWord(getState(), cellKeyToPositionInWord(cellKey));
      if (letterAtIndex) {
        const keyboardUIRemoveAction: ILetterKey = {
          letter: letterAtIndex.letter as KeyboardLetter,
          letterColor: 'GREY_OUTLINE',
          checked: false,
        };
        dispatch(updateKeyboardLetters([keyboardUIRemoveAction]));
        dispatch(removeMatchLetter(letterAtIndex));
      }
      const matchColor = isExistsMatchType ? KEYBOARD_COLORS.ORANGE : KEYBOARD_COLORS.GREEN;
      const rowUIAction = { rowKey, cellKey, letter, color: matchColor };
      dispatch(isExistsMatchType ? addExistsMatchLetter(matchLetter) : addExactMatchLetter(matchLetter));
      dispatch(setCellProps(rowUIAction));
      keyboardUIAction.letterColor = matchColor;
      keyboardUIAction.checked = true;
      dispatch(selectNextEmptyCell(cellKey));
    }

    // update UI
    dispatch(updateKeyboardLetters([keyboardUIAction]));
  };

export const selectNextEmptyCell =
  (cellKey: CellKey): AppThunk =>
  (dispatch, getState) => {
    const emptyCells = getAllEmptyCells(getState());
    const nextEmptyIndex = emptyCells.findIndex((ck) => ck !== cellKey);
    if (nextEmptyIndex !== -1) {
      dispatch(updateSelectedCell(emptyCells[nextEmptyIndex]));
    }
  };

export const updateSelectedCell =
  (cellKey: CellKey): AppThunk =>
  (dispatch) => {
    dispatch(setSelectedCell(cellKey));
    const rowUIAction = { rowKey, cellKey: cellKey, selected: true };
    dispatch(setCellSelectedByRowAndCellId(rowUIAction));
  };

export const resetStatsState = (): AppThunk => (dispatch, getState) => {
  const rowKey: RowKey = 'ROW_1' as RowKey;
  const cellKey: CellKey = 'CELL_1' as CellKey;

  // update UI
  const rowUIAction = { rowKey, cellKey, selected: true };
  const matchType = getSelectedMatchType(getState());
  dispatch(resetCellsByRowId(rowKey));
  dispatch(setCellSelectedByRowAndCellId(rowUIAction));
  dispatch(setKeyboardColor(getKeyboardColorByMatchType(matchType.type)));
};

export const wordleStatsSlice = createSlice({
  name: 'wordlestats',
  initialState,
  reducers: {
    addExactMatchLetter: (state, action: PayloadAction<ILetterModel>) => {
      state.selectedLetters.push({ ...action.payload, matchType: OMatchType.EXACT });
    },
    removeExactMatchLetter: (state, action: PayloadAction<ILetterModel>) => {
      state.selectedLetters = state.selectedLetters.filter(
        (l) => !(l.letter === action.payload.letter && l.indexInWord === action.payload.indexInWord)
      );
    },
    addExistsMatchLetter: (state, action: PayloadAction<ILetterModel>) => {
      state.selectedLetters.push({ ...action.payload, matchType: OMatchType.EXISTS });
    },
    removeExistsMatchLetter: (state, action: PayloadAction<ILetterModel>) => {
      state.selectedLetters = state.selectedLetters.filter(
        (l) => !(l.letter === action.payload.letter && l.indexInWord === action.payload.indexInWord)
      );
    },
    removeMatchLetter: (state, action: PayloadAction<ILetterModel>) => {
      state.selectedLetters = state.selectedLetters.filter(
        (l) => !(l.letter === action.payload.letter && l.indexInWord === action.payload.indexInWord)
      );
    },
    removeMissingLetter: (state, action: PayloadAction<ILetterModel>) => {
      state.selectedLetters = state.selectedLetters.filter(
        (l) => !(l.letter === action.payload.letter && l.indexInWord === action.payload.indexInWord)
      );
    },
    addMissingLetter: (state, action: PayloadAction<ILetterModel>) => {
      state.selectedLetters.push({ ...action.payload, matchType: OMatchType.MISSING });
    },
    setSelectedCell: (state, action: PayloadAction<CellKey>) => {
      state.selectedCell = action.payload;
    },
    setSelectedMatchType: (state, action: PayloadAction<IMatchType>) => {
      state.matchType = action.payload;
    },
    setGuessResults: (state, action: PayloadAction<TResultGuessWords>) => {
      state.guessWords = action.payload.guessWords;
      state.guessWordsIndexes = action.payload.guessWordsIndexes;
      state.isCompleted = true;
    },
    resetGame: () => {
      return initialState;
    },
  },
});

export const {
  resetGame,
  addExactMatchLetter,
  removeMatchLetter,
  removeExactMatchLetter,
  addExistsMatchLetter,
  removeExistsMatchLetter,
  addMissingLetter,
  removeMissingLetter,
  setSelectedMatchType,
  setSelectedCell,
  setGuessResults,
} = wordleStatsSlice.actions;

export const getWordleStats = (state: RootState): IWordleStatsState => state.puzzle.wordlestats;
export const isCompleted = (state: RootState): boolean => state.puzzle.wordlestats.isCompleted;
export const getSelectedCell = (state: RootState): CellKey => state.puzzle.wordlestats.selectedCell;
export const getSelectedMatchType = (state: RootState): IMatchType => state.puzzle.wordlestats.matchType;
export const getSelectedLetters = (state: RootState): Array<ISelectedLetter> =>
  state.puzzle.wordlestats.selectedLetters || [];

export const getMissingLetters = (state: RootState): Array<string> => {
  return getSelectedLetters(state)
    .filter((sl: ISelectedLetter) => sl.matchType === OMatchType.MISSING)
    .map((sl) => sl.letter);
};
export const getMissingLettersAsLetterModels = (state: RootState): Array<ILetterModel> => {
  return getSelectedLetters(state).filter((sl: ISelectedLetter) => sl.matchType === OMatchType.MISSING);
};
export const getExactLetters = (state: RootState): Array<ILetterModel> => {
  return getSelectedLetters(state).filter((sl: ISelectedLetter) => sl.matchType === OMatchType.EXACT);
};
export const getExistLetters = (state: RootState): Array<ILetterModel> => {
  return getSelectedLetters(state).filter((sl: ISelectedLetter) => sl.matchType === OMatchType.EXISTS);
};
export const getMatchLettersAsLetterModels = (state: RootState): Array<ILetterModel> => {
  return getSelectedLetters(state).filter((sl: ISelectedLetter) => sl.matchType !== OMatchType.MISSING);
};
export const getMatchLettersAsSelectedLetter = (state: RootState): Array<ISelectedLetter> => {
  return getSelectedLetters(state).filter((sl: ISelectedLetter) => sl.matchType !== OMatchType.MISSING);
};
export const getMatchLettersAsLetterSpots = (state: RootState): Array<ISelectedLetter> => {
  const matchedLetters = getSelectedLetters(state).filter((sl: ISelectedLetter) => sl.matchType !== OMatchType.MISSING);
  let letterSpots: Array<ISelectedLetter> = [];
  for (let i = 0; i < 5; i++) {
    const matchedIndex = matchedLetters.findIndex((ml) => ml.indexInWord === i);
    const letter = matchedIndex !== -1 ? matchedLetters[matchedIndex].letter : '';
    const matchType = matchedIndex !== -1 ? matchedLetters[matchedIndex].matchType : OMatchType.NONE;
    let spot: ISelectedLetter = {
      letter: letter,
      indexInWord: i,
      matchType: matchType,
    };
    letterSpots.push(spot);
  }

  return letterSpots;
};
export const getCellKeysOfMatchLetters = (state: RootState): Array<CellKey> => {
  return getMatchLettersAsLetterModels(state).map((sl: ILetterModel) => positionInWordToCellKey(sl.indexInWord));
};

export const getAllEmptyCells = (state: RootState): Array<CellKey> => {
  let cells: Array<CellKey> = ['CELL_1', 'CELL_2', 'CELL_3', 'CELL_4', 'CELL_5'];
  const matchedKeys: Array<CellKey> = getCellKeysOfMatchLetters(state);
  return removeIntersectingItems(cells, matchedKeys).map((item) => item as CellKey);
};

export const getAllSelectedLettersAsLetterKeys = (state: RootState): Array<ILetterKey> => {
  const missingMatchLetters: Array<ILetterModel> = getMissingLettersAsLetterModels(state);
  const exactMatchLetters: Array<ILetterModel> = getExactLetters(state);
  const existMatchLetters: Array<ILetterModel> = getExistLetters(state);
  let letterArray: Array<ILetterKey> = [];

  letterArray.push(...getKeyboardLetters(missingMatchLetters, KEYBOARD_COLORS.GREY));
  letterArray.push(...getKeyboardLetters(exactMatchLetters, KEYBOARD_COLORS.GREEN));
  letterArray.push(...getKeyboardLetters(existMatchLetters, KEYBOARD_COLORS.ORANGE));

  return letterArray;
};

export const getCalculatedMatchedWords = (state: RootState): TResultGuessWords => ({
  guessWords: state.puzzle.wordlestats.guessWords,
  guessWordsIndexes: state.puzzle.wordlestats.guessWordsIndexes,
});

export const isLetterInSelectedLetterList = (state: RootState, letter: string): boolean =>
  state.puzzle.wordlestats.selectedLetters.findIndex((sl: ISelectedLetter) => sl.letter === letter) !== -1;

export const isLetterAtPositionInSelectedLetterList = (state: RootState, letter: string, position: number): boolean =>
  state.puzzle.wordlestats.selectedLetters.findIndex(
    (sl: ISelectedLetter) => sl.letter === letter && sl.indexInWord === position
  ) !== -1;

export const getLetterOccurencesInSelectedLetterList = (state: RootState, letter: string): Array<ISelectedLetter> => {
  const matchedSelectedLetters = getMatchLettersAsSelectedLetter(state);
  return matchedSelectedLetters.filter((ml) => ml.letter === letter);
};

export const getLetterAtIndexInWord = (state: RootState, position: number): ISelectedLetter | undefined => {
  const matchedSelectedLetters = getMatchLettersAsSelectedLetter(state);
  return matchedSelectedLetters.find((ml) => ml.indexInWord === position);
};

export default wordleStatsSlice.reducer;
