import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../../../../../app/store';
import {
  getExactMatches,
  getExistsMatches,
  removeNonExistentLetterIndexes,
  removeNonExistentLetterIndexesAtIndex,
} from '../../../PuzzleWordle-helpers';
import { ILetterModel, IWordleDictionary } from '../../../PuzzleWordle.types';
import { allAvailableWords } from '../../../PuzzleWords';
import { addWord } from '../wordleVersusGameSlice';
import { IRobotSolution, IWordStatus, TRobotStatus } from './RobotSolver.types';

const initialState: IRobotSolution = {
  currentWordIndex: 0,
  attempts: 0,
  exactMatchLetter: [],
  existsMatchLetter: [],
  nonExistentLetters: [],
  nonExistentLetterAtIndex: [],
  usedWordIndexes: [],
  usedWords: [],
  availableWordIndexes: Array.from(Array(allAvailableWords.length).keys()),
  isFound: false,
  isCompleted: false,
  displayColors: [],
  statInfoTracker: '',
  guessWords: [],
  guessWordsStatus: [],
  robotStatus: 'idle',
};

export const isLetterModelUnique = (
  letterModels: Array<ILetterModel>,
  lmToAdd: ILetterModel
) =>
  letterModels.findIndex(
    (lm) =>
      lm.letter === lmToAdd.letter && lm.indexInWord === lmToAdd.indexInWord
  ) === -1;

export const addUniqueLetterModel = (
  letterModels: Array<ILetterModel>,
  lmToAdd: ILetterModel
) => {
  return isLetterModelUnique(letterModels, lmToAdd)
    ? [...letterModels, lmToAdd]
    : letterModels;
};

export const addUniqueLetter = (letters: Array<string>, letter: string) => {
  return !letters.includes(letter) ? [...letters, letter] : letters;
};

type ICalcAvailableProps = {
  exactMatchLetter: Array<ILetterModel>;
  existsMatchLetter: Array<ILetterModel>;
  nonExistentLetters: Array<string>;
  nonExistentLetterAtIndex: Array<ILetterModel>;
  availableWordIndexes: Array<number>;
  dictionary: IWordleDictionary;
};

const isLetterInWordMoreThanOnce = (char: string, word: Array<string>) =>
  word.indexOf(char) !== word.lastIndexOf(char);

const isLetterHasMatchInWord = (
  char: string,
  word: Array<string>,
  colors: Array<string>
) =>
  word.findIndex((l, index) => l === char && colors[index] !== 'GREY') !== -1;

const isLetterMissAtIndex = (
  char: string,
  word: Array<string>,
  colors: Array<string>
) =>
  isLetterInWordMoreThanOnce(char, word) &&
  isLetterHasMatchInWord(char, word, colors);

export const caclulateAvailableIndexes = ({
  exactMatchLetter: exact,
  existsMatchLetter: exist,
  nonExistentLetters: miss,
  nonExistentLetterAtIndex: missAt,
  availableWordIndexes: available,
  dictionary: dict,
}: ICalcAvailableProps): Array<number> => {
  console.log(`Count before reducing... ${available.length}`);
  let wordIndexes = getExactMatches(exact, [...available], dict);
  console.log(`Count after exact matches... ${wordIndexes.length}`);
  wordIndexes = getExistsMatches(exist, exact, missAt, wordIndexes, dict);
  console.log(`Count after exists matches... ${wordIndexes.length}`);
  wordIndexes = removeNonExistentLetterIndexes(miss, wordIndexes, dict);
  console.log(`Count after misses... ${wordIndexes.length}`);
  wordIndexes = removeNonExistentLetterIndexesAtIndex(
    missAt,
    wordIndexes,
    dict
  );
  console.log(`Count after misses at index matches... ${wordIndexes.length}`);
  return wordIndexes;
};

export const setRoundComplete =
  (isWon: boolean): AppThunk =>
  (dispatch) => {
    console.log(`Robot ${isWon ? 'won' : 'lost'} this round`);
    dispatch(resetRobotSolution());
  };

export const analyzeGuessWordStatus =
  (dictionary: IWordleDictionary): AppThunk =>
  (dispatch, getState) => {
    const guessWordsStatus = getGuessWordsStatus(getState());
    const totalCount = guessWordsStatus.length;
    const availableWordIndexes = getAvailableWordIndexes(getState());
    const lastGuessStatus = guessWordsStatus[totalCount - 1];
    let exactLetters = getExactMatchedLetters(getState());
    let existLetters = getExistMatchedLetters(getState());
    let missLetters = getNonExistentLetters(getState());
    let missLettersAtIndex = getNonExistentAtIndexLetters(getState());

    if (!lastGuessStatus) {
      return;
    }

    let exact: Array<ILetterModel> = [];
    let exist: Array<ILetterModel> = [];
    let miss: Array<string> = [];
    let missAtIndex: Array<ILetterModel> = [];

    const word = lastGuessStatus.word.split('');
    const lastGuessColors = lastGuessStatus.colors;

    console.log(`Last word: ${word}, colors: ${lastGuessStatus?.colors}`);

    lastGuessColors?.forEach((color: string, index: number) => {
      const letter = word[index];
      const lmToAdd = { indexInWord: index, letter: letter };

      if (color === 'GREEN') {
        exact = isLetterModelUnique(exactLetters, lmToAdd)
          ? [...exact, lmToAdd]
          : [...exact];
      } else if (color === 'ORANGE') {
        exist = isLetterModelUnique(existLetters, lmToAdd)
          ? [...exist, lmToAdd]
          : [...exist];
      } else if (isLetterMissAtIndex(letter, word, lastGuessColors)) {
        missAtIndex = isLetterModelUnique(missLettersAtIndex, lmToAdd)
          ? [...missAtIndex, lmToAdd]
          : [...missAtIndex];
      } else {
        miss = !missLetters.includes(letter) ? [...miss, letter] : [...miss];
      }
    });

    let currentWordIndexes = caclulateAvailableIndexes({
      exactMatchLetter: exact,
      existsMatchLetter: exist,
      nonExistentLetters: miss,
      nonExistentLetterAtIndex: missAtIndex,
      availableWordIndexes: [...availableWordIndexes],
      dictionary: dictionary,
    });

    console.log(`Count after reduction... ${currentWordIndexes.length}`);
    dispatch(
      setRobotGuess({
        exactMatchLetter: [...exactLetters, ...exact],
        existsMatchLetter: [...existLetters, ...exist],
        nonExistentLetters: [...missLetters, ...miss],
        nonExistentLetterAtIndex: [...missLettersAtIndex, ...missAtIndex],
        availableWordIndexes: currentWordIndexes,
        robotStatus: 'calculate-robot-guess',
      })
    );
  };

export const pickNextGuessWordAndStartSolvingPuzzle =
  (dictionary: IWordleDictionary): AppThunk =>
  (dispatch, getState) => {
    const availableWordIndexes = getAvailableWordIndexes(getState());
    const wordCount = availableWordIndexes.length;
    if (wordCount > 0) {
      const randomIndex =
        wordCount !== 1 ? Math.round(Math.random() * (wordCount - 1)) : 0;
      const wordIndex = availableWordIndexes[randomIndex];
      const word = dictionary.words[wordIndex];
      dispatch(addRobotGuess(word, wordIndex));
    } else console.log('pick a word error, but availableWordIndexes is empty');
  };

export const addRobotGuess =
  (word: string, wordIndex: number): AppThunk =>
  (dispatch, getState) => {
    const robotGuessPayload: Partial<IRobotSolution> = {
      robotStatus: 'submit-robot-guess',
      attempts: getRobotAttemptCount(getState()) + 1,
      guessWords: [...getRobotGuessWords(getState()), word],
      usedWords: [...getRobotUsedWords(getState()), word],
      usedWordIndexes: [...getRobotUsedWordIndexes(getState()), wordIndex],
      currentWordIndex: wordIndex,
    };
    // set robot solution in this store
    dispatch(setRobotGuess(robotGuessPayload));
    // set word in game store
    dispatch(addWord(word));
  };

// export const findNextBextGuess =
//   (dictionary: IWordleDictionary): AppThunk =>
//   (dispatch, getState) => {
//     const guessWordsStatus = getGuessWordsStatus(getState());
//     const availableWordIndexes = getAvailableWordIndexes(getState());
//     const robotAttemptCount = getRobotAttemptCount(getState());
//     const lastGuess = [...guessWordsStatus].pop();

//     console.log(`Last word: ${lastGuess?.word}, colors: ${lastGuess?.colors}`);

//     let nextWordIndex = 0;
//     const totalWords = availableWordIndexes.length;
//     if (6 - robotAttemptCount >= totalWords || totalWords === 1) {
//       return 0;
//     } else if (totalWords < 10) {
//       const words: Array<string> = [];
//       availableWordIndexes.forEach((wordIndex: number) => {
//         words.push(dictionary.words[wordIndex]);
//       });
//       words.sort();
//       const selectedWord = words[Math.ceil(words.length / 2)];
//       const id = dictionary.words.indexOf(selectedWord);
//       nextWordIndex = availableWordIndexes.indexOf(id === -1 ? 0 : id);
//     }

//     nextWordIndex = Math.floor(availableWordIndexes.length / 2);
//     const nextWord = dictionary.words[nextWordIndex];
//     dispatch(addRobotGuess(nextWord, nextWordIndex));
//   };

// type IGameRoundStateWithRoundKey = IGameRoundState & { roundKey: RoundKey };
// type IsValidWordByRoundId = { roundKey: RoundKey; isValid: boolean };
// type SetNewGame = { gameId: GameId; isUserGame: boolean; wod: string };
// type AddWordToRoundAction = PayloadAction<IGameRoundStateWithRoundKey>;
// type SetIsValidWordAction = PayloadAction<IsValidWordByRoundId>;
// type SetNewGameAction = PayloadAction<SetNewGame>;

export const robotSolutionSlice = createSlice({
  name: 'wvsrobotsolution',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setCurrentWordIndex: (state, action: PayloadAction<number>) => {
      state.currentWordIndex = action.payload;
    },
    setRobotStatus: (state, action: PayloadAction<TRobotStatus>) => {
      state.robotStatus = action.payload;
    },
    setRobotGuessWordStatus: (state, action: PayloadAction<IWordStatus>) => {
      state.guessWordsStatus = [...state.guessWordsStatus, action.payload];
      state.robotStatus = 'analyze-robot-guess-result';
    },
    setUpdatedSolution: (
      state,
      action: PayloadAction<Partial<IRobotSolution>>
    ) => {
      return { ...state, ...action.payload };
    },
    setRobotGuess: (state, action: PayloadAction<Partial<IRobotSolution>>) => {
      return { ...state, ...action.payload };
    },
    setAvilableWordIndexes: (state, action: PayloadAction<Array<number>>) => {
      state.availableWordIndexes = action.payload;
    },
    resetRobotSolution: () => ({ ...initialState }),
  },
});

export const {
  setCurrentWordIndex,
  setRobotStatus,
  setRobotGuess,
  setAvilableWordIndexes,
  setRobotGuessWordStatus,
  resetRobotSolution,
} = robotSolutionSlice.actions;

export const getRobotStatus = (state: RootState): TRobotStatus =>
  state.puzzle.wvsrobotsolution.robotStatus;
export const isRobotPickingWord = (
  state: RootState,
  status: string = 'robot-picking-word'
): boolean => state.puzzle.wvsrobotsolution.robotStatus === status;
export const getGuessWordsStatus = (state: RootState): Array<IWordStatus> =>
  state.puzzle.wvsrobotsolution.guessWordsStatus;
export const getRobotAttemptCount = (state: RootState): number =>
  state.puzzle.wvsrobotsolution.attempts;
export const getRobotGuessWords = (state: RootState): Array<string> =>
  state.puzzle.wvsrobotsolution.guessWords;
export const getRobotUsedWords = (state: RootState): Array<string> =>
  state.puzzle.wvsrobotsolution.usedWords;
export const getRobotUsedWordIndexes = (state: RootState): Array<number> =>
  state.puzzle.wvsrobotsolution.usedWordIndexes;
export const getAvailableWordIndexes = (state: RootState): Array<number> =>
  state.puzzle.wvsrobotsolution.availableWordIndexes;
export const getExactMatchedLetters = (state: RootState): Array<ILetterModel> =>
  state.puzzle.wvsrobotsolution.exactMatchLetter;
export const getExistMatchedLetters = (state: RootState): Array<ILetterModel> =>
  state.puzzle.wvsrobotsolution.existsMatchLetter;
export const getNonExistentLetters = (state: RootState): Array<string> =>
  state.puzzle.wvsrobotsolution.nonExistentLetters;
export const getNonExistentAtIndexLetters = (
  state: RootState
): Array<ILetterModel> =>
  state.puzzle.wvsrobotsolution.nonExistentLetterAtIndex;

export default robotSolutionSlice.reducer;
