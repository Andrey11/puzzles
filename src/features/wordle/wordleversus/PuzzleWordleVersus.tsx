import React, { useEffect, useRef, useState } from 'react';

import {
  getLogStyles,
  getRandomWord,
} from '../PuzzleWordle-helpers';

import styles from './PuzzleWordleVersus.module.scss';

import { useAppDispatch, useAppSelector } from '../../../app/hooks/hooks';
import { PUZZLES } from '../../../app/App.types';
import { getActivePuzzle, setActivePuzzle } from '../../../app/appSlice';
import UserWordSelector from './components/wordleselector/UserWordSelector';
import { useDialog } from '../components/modal/Dialog';
import { Joystick, PencilSquare } from 'react-bootstrap-icons';
import WordleVersusGame from './game/WordleVersusGame';
import {
  isLostGame,
  isWonGame,
} from './game/wordleVersusGameSlice';
import {
  isMatchFinished,
  setMaxGames,
  startWordleVersusGame,
  startWordleVersusMatch,
  startWordleVersusNextGame,
} from './wordleVersusSlice';
import Score from '../components/score/Score';
import WordleDictionaryOffcanvas from '../components/dictionary/WordleDictionaryOffcanvas';
import {
  createDictionary,
  getDictionaryStatus,
  isDictionaryLoaded,
} from '../components/dictionary/wordleDictionarySlice';
import WordleVersusGameSettings from './components/roundselector/GameSettingsSelector';
import RobotSolver from './game/robot/RobotSolver';

type IPuzzleWordleVersusProps = {
  games?: number;
};

// const NON_BREAKING_SPACE: JSX.Element = <>&nbsp;</>;

// const START_WORD = 'OCEAN';

// const initialSolutionModel = (): ISolutionModel => {
//   return {
//     currentWordIndex: 0,
//     attempts: 0,
//     matchedLetters: [],
//     existsMatchLetter: [],
//     nonExistentLetters: [],
//     nonExistentLetterAtIndex: [],
//     usedWordIndexes: [],
//     exactMatchLetter: [],
//     usedWords: [],
//     availableWordIndexes: Array.from(Array(allAvailableWords.length).keys()),
//   };
// };

const WordleVsLog = getLogStyles({
  cmpName: 'PuzzleWordleVersus',
  cmpNameCls: 'color: #fd8008; font-weight: bold;',
});

const PuzzleWordleVersus: React.FunctionComponent<IPuzzleWordleVersusProps> = ({
  games = 1,
}: IPuzzleWordleVersusProps) => {
  // const selectRef = useRef<SelectInstance | null>();
  // const startingWordRef = useRef<SelectInstance | null>();
  // const wordRunnerRef = useRef<number>(0);
  const bodyContainerRef = useRef(null);
  // const guessRowTargetRef: React.RefObject<any> = useRef(null);
  const dispatch = useAppDispatch();

  // const dictionary = useAppSelector(getDictionary);
  const dictionaryLoaded = useAppSelector(isDictionaryLoaded);
  const dictionaryStatus = useAppSelector(getDictionaryStatus);
  const activePuzzle = useAppSelector(getActivePuzzle);

  const [selectedWord, setSelectedWord] = useState<string>('');
  // const [startingWord, setStartingWord] = useState<string>('');
  // const [statTracker, setStatTracker] = useState<Array<IStat>>([]);
  // const [robotFinished, setRobotFinished] = useState<boolean>(false);

  const [isInit, setIsInit] = useState<boolean>(false);

  const isWon = useAppSelector(isWonGame);
  const isLost = useAppSelector(isLostGame);

  // const isRobotTurn = !useAppSelector(isUserGame);

  const matchFinished = useAppSelector(isMatchFinished);

  const [startMatch, setStartMatch] = useState<boolean>(false);

  const {
    DialogComponent: SelectWordForRobotDialog,
    setDialogVisible: setVisibleSelectWordForRobotDialog,
    dialogVisible: isVisibleSelectWordForRobotDialog,
  } = useDialog({
    title: 'Select your word',
    body: <UserWordSelector onWordSelected={setSelectedWord} />,
    infoTrigger: <PencilSquare size={18} />,
    onCloseDialogCallback: () => {
      if (selectedWord) {
        dispatch(startWordleVersusNextGame(selectedWord));
      }
    },
  });

  const {
    DialogComponent: StartGameDialog,
    setDialogVisible: setVisibleStartGameDialog,
    dialogVisible: isVisibleStartGameDialog,
  } = useDialog({
    title: 'Game Settings',
    body: (
      <WordleVersusGameSettings
        onRoundsSelected={(rounds) => {
          dispatch(setMaxGames(rounds));
        }}
      />
    ),
    actionButtonLabel: 'Begin',
    infoTrigger: <Joystick size={18} />,
    onCloseDialogCallback: () => {
      dispatch(startWordleVersusMatch());
      setStartMatch(true);
    },
  });

  useEffect(() => {
    if (startMatch) {
      // setStartingWord(START_WORD);
      const aiGuessWord = getRandomWord();
      dispatch(startWordleVersusGame(1, true, aiGuessWord));
      setStartMatch(false);
    }
  }, [dispatch, startMatch]);

  useEffect(() => {
    if (!isInit) {
      setIsInit(true);
      // console.log(...WordleVsLog.logSuccess('initializing'));
    } else if (isInit && activePuzzle !== PUZZLES.WORDLE_VERSUS) {
      dispatch(setActivePuzzle(PUZZLES.WORDLE_VERSUS));
      console.log(...WordleVsLog.logAction('activating wordle versus'));
    }
  }, [isInit, activePuzzle, dispatch]);

  useEffect(() => {
    if (!dictionaryLoaded && dictionaryStatus !== 'loaded' && isInit) {
      dispatch(createDictionary());
      console.log(...WordleVsLog.logAction('creating wordle dictionary'));
    } else if (dictionaryLoaded && dictionaryStatus === 'loaded' && isInit) {
      console.log(...WordleVsLog.logSuccess('wordle dictionary loaded'));
      setVisibleStartGameDialog(true);
    }
  }, [
    dictionaryLoaded,
    dictionaryStatus,
    dispatch,
    isInit,
    setVisibleStartGameDialog,
  ]);

  useEffect(() => {
    if (!matchFinished && (isWon || isLost)) {
      const timeoutId = setTimeout(() => {
        setVisibleSelectWordForRobotDialog(true);
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [isWon, isLost, matchFinished, setVisibleSelectWordForRobotDialog]);

  useEffect(() => {
    if (matchFinished) {
      console.log('Match is finished');
    }
  }, [matchFinished]);

  // useEffect(() => {
  //   if (isRobotTurn && !robotFinished) {
  //     console.log('Robot starting solving puzzle');
  //     dispatch(startWordleVersusNextGame(selectedWord));
  //   } else if (isRobotTurn && robotFinished) {
  //     const resultString = statTracker[0].guesses;
  //     console.log(`Robot finished solving puzzle ${resultString}`);
  //     const guessesString = resultString.slice(0, resultString.length - 1);
  //     const guesses = guessesString.split('|');

  //     console.log(`Number of guesses: ${guesses.length}`);

  //     for (let i = 0; i < guesses.length; i++) {
  //       const word = guesses[i].slice(0, 5);
  //       dispatch(addWord(word));
  //       dispatch(onSubmitGuess());
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isRobotTurn, robotFinished, selectedWord]);

  // const puzzleSolver = async (startPuzzleSolution: IPuzzleSolution) => {
  //   let puzzleSolution: IPuzzleSolution = startPuzzleSolution;

  //   while (!puzzleSolution.isCompleted) {
  //     const guessResultPromise: Promise<IPuzzleSolution> =
  //       makeGuess(startPuzzleSolution);
  //     await guessResultPromise
  //       // eslint-disable-next-line no-loop-func
  //       .then((lastGuessSolution: IPuzzleSolution) => {
  //         puzzleSolution = lastGuessSolution;
  //       })
  //       // eslint-disable-next-line no-loop-func
  //       .catch((lastGuessSolutionError: IPuzzleSolution) => {
  //         puzzleSolution = lastGuessSolutionError;
  //       })
  //       // eslint-disable-next-line no-loop-func
  //       .finally(() => {
  //         const hasWords =
  //           puzzleSolution.usedWords && puzzleSolution.usedWords.length > 0;
  //         const guessIndex: number = hasWords
  //           ? puzzleSolution.usedWords.length - 1
  //           : -1;
  //         // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //         const lastWord: string = hasWords
  //           ? puzzleSolution.usedWords[guessIndex]
  //           : '';
  //         // displayStatus(
  //         //   puzzleSolution.attempts,
  //         //   puzzleSolution.displayColors,
  //         //   lastWord
  //         // );
  //       });
  //   }

  //   return puzzleSolution;
  // };

  // const solveWordlePuzzle = (wod: string): Promise<IPuzzleSolution> => {
  //   const puzzleSolution: IPuzzleSolution = {
  //     ...initialSolutionModel(),
  //     displayColors: [],
  //     isFound: false,
  //     isCompleted: false,
  //     statInfoTracker: '',
  //     wod: '',
  //   };

  //   const solutionPromise: Promise<IPuzzleSolution> = new Promise(
  //     async (resolve, reject) => {
  //       const resultSolution = await puzzleSolver(puzzleSolution);

  //       if (resultSolution.isCompleted && resultSolution.isFound) {
  //         resolve(resultSolution);
  //       } else {
  //         reject(resultSolution);
  //       }
  //     }
  //   );

  //   let solverSolution: IPuzzleSolution = puzzleSolution;

  //   solutionPromise
  //     .then((value: IPuzzleSolution) => {
  //       // console.log(`${wordRunnerRef.current}\tPASS: ${wod} guesses ${value.usedWords.toString()}`);
  //       solverSolution = value;
  //     })
  //     .catch((value: IPuzzleSolution) => {
  //       // console.log(`${wordRunnerRef.current}\tFAIL: ${wod} guesses ${value.usedWords.toString()}`);
  //       solverSolution = value;
  //     })
  //     .finally(() => {
  //       const successStyle = 'color: green; font-weight: bold;';
  //       const failuerStyle = 'color: red; font-weight: bold;';
  //       const wodStyle = 'color: blue; font-weight: lighter;';
  //       const solutionStyle = 'color: #555555; font-weight: lighter;';
  //       const resultStyle = solverSolution.isFound
  //         ? successStyle
  //         : failuerStyle;
  //       const statusText = solverSolution.isFound ? '%cPASS' : '%cFAIL';
  //       const stats = {
  //         status: statusText,
  //         wod: wod,
  //         guesses: solverSolution.statInfoTracker,
  //       };

  //       let statTrak: Array<IStat> = [];
  //       if (statTracker) {
  //         statTrak = statTracker;
  //       }
  //       statTrak.push(stats);
  //       setStatTracker(statTrak);
  //       console.log(
  //         `${wordRunnerRef.current}\t${statusText}: %c${wod} %c${solverSolution.statInfoTracker}`,
  //         resultStyle,
  //         wodStyle,
  //         solutionStyle
  //       );

  //       const exactSpots = solverSolution.exactMatchLetter || [];
  //       const existSpots = solverSolution.existsMatchLetter || [];
  //       const nonExistent = solverSolution.nonExistentLetters || [];
  //       const exactStr = exactSpots
  //         .map((s) => `{let: ${s.letter}, pos: ${s.indexInWord}}`)
  //         .join(',');
  //       const existsStr = existSpots
  //         .map((s) => `{let: ${s.letter}, pos: ${s.indexInWord}}`)
  //         .join(', ');
  //       console.log(
  //         `Analyze Solution: exact: ${exactStr}, exists: ${existsStr}, miss: ${nonExistent.toString()}`
  //       );
  //       setRobotFinished(true);
  //       // setGuessingInProgress(false);
  //     });

  //   return solutionPromise;
  // };

  // const getResults = (solution: IPuzzleSolution): IPuzzleSolution => {
  //   const attemptNum = solution.attempts;
  //   const lastGuess = solution.usedWords[attemptNum - 1];
  //   let wod = '';
  //   const resultStatus: Array<number> = [0, 0, 0, 0, 0];
  //   if (lastGuess === selectedWord) {
  //     // console.log(`PASS: wod: ${selectedWord}, guesses (${attemptNum}) = ${solution.usedWords}`);
  //     solution.displayColors = ['green', 'green', 'green', 'green', 'green'];
  //     solution.exactMatchLetter = lastGuess
  //       .split('')
  //       .map((l, index) => ({ letter: l, indexInWord: index }));
  //     solution.existsMatchLetter = [];
  //     solution.isFound = true;
  //     return solution;
  //   } else {
  //     const colors: Array<string> = [];
  //     const nonExistentLetterAtIndex: Array<ILetterModel> =
  //       solution.nonExistentLetterAtIndex;
  //     const matchedLetters: Array<string> = []; //solution.matchedLetters;
  //     const existsMatchLetters: Array<ILetterModel> = []; //solution.existsMatchLetter;
  //     const exactMatches: Array<string> = []; //solution.exactMatchLetter.map((exactMatch) => {
  //     const exactMatchLetters: Array<ILetterModel> = []; //solution.exactMatchLetter;
  //     const nonExistentLetters: Array<string> = solution.nonExistentLetters;

  //     lastGuess.split('').forEach((letter: string, index: number) => {
  //       if (letter === selectedWord.charAt(index)) {
  //         wod = wod.concat('2');
  //         resultStatus[index] = 2;
  //         exactMatches.push(letter);
  //         exactMatchLetters.push({ letter: letter, indexInWord: index });
  //       } else {
  //         wod = wod.concat(selectedWord[index]);
  //       }
  //     });

  //     lastGuess.split('').forEach((letter: string, index: number) => {
  //       if ('2' === wod.charAt(index)) {
  //         colors.push('green');
  //       } else if (wod.indexOf(letter) !== -1) {
  //         wod = wod.replace(letter, '1');
  //         resultStatus[index] = 1;
  //         matchedLetters.push(letter);
  //         existsMatchLetters.push({ letter: letter, indexInWord: index });
  //         colors.push('orange');
  //       } else {
  //         colors.push('grey');
  //         // letter does not exist in WOD
  //         if (
  //           matchedLetters.indexOf(letter) === -1 &&
  //           exactMatches.indexOf(letter) === -1
  //         ) {
  //           if (!nonExistentLetters.includes(letter)) {
  //             nonExistentLetters.push(letter);
  //           }
  //           // WOD contains multiple instances of a letter
  //         } else if (
  //           exactMatches.indexOf(letter) !== -1 &&
  //           matchedLetters.indexOf(letter) === -1
  //         ) {
  //           const exactMatchesForLetter = exactMatchLetters
  //             .filter((ml: ILetterModel) => ml.letter === letter)
  //             .map((val: ILetterModel) => val.indexInWord);
  //           selectedWord.split('').forEach((l: string, letterIndex: number) => {
  //             if (!exactMatchesForLetter.includes(letterIndex)) {
  //               nonExistentLetterAtIndex.push({
  //                 letter: letter,
  //                 indexInWord: letterIndex,
  //               });
  //             }
  //           });
  //           // letter exists in WOD, but in a different spot
  //         } else {
  //           nonExistentLetterAtIndex.push({
  //             letter: letter,
  //             indexInWord: index,
  //           });
  //         }
  //       }
  //     });

  //     solution.displayColors = colors;
  //     solution.exactMatchLetter = exactMatchLetters;
  //     solution.matchedLetters = matchedLetters;
  //     solution.existsMatchLetter = existsMatchLetters;
  //     solution.nonExistentLetters = nonExistentLetters;
  //     solution.nonExistentLetterAtIndex = nonExistentLetterAtIndex;
  //     // console.log(`ResultStatus: ${resultStatus.toString()}`);
  //     return getNextIndex(solution);
  //   }
  // };

  // const getNextIndex = (solution: IPuzzleSolution): IPuzzleSolution => {
  //   let currentWordIndexes: Array<number> = [...solution.availableWordIndexes];
  //   const {
  //     exactMatchLetter,
  //     existsMatchLetter,
  //     nonExistentLetterAtIndex,
  //     nonExistentLetters,
  //   } = solution;

  //   currentWordIndexes = getExactMatches(
  //     exactMatchLetter,
  //     currentWordIndexes,
  //     dictionary
  //   );
  //   currentWordIndexes = getExistsMatches(
  //     existsMatchLetter,
  //     exactMatchLetter,
  //     nonExistentLetterAtIndex,
  //     currentWordIndexes,
  //     dictionary
  //   );
  //   currentWordIndexes = removeNonExistentLetterIndexes(
  //     nonExistentLetters,
  //     currentWordIndexes,
  //     dictionary
  //   );
  //   currentWordIndexes = removeNonExistentLetterIndexesAtIndex(
  //     nonExistentLetterAtIndex,
  //     currentWordIndexes,
  //     dictionary
  //   );

  //   const aIndex = currentWordIndexes[0];
  //   solution.currentWordIndex =
  //     currentWordIndexes[aIndex] || solution.currentWordIndex + 1;
  //   solution.availableWordIndexes = currentWordIndexes;
  //   // console.log(`Available guesses: ${solution.availableWordIndexes.length}`);
  //   return solution;
  // };

  // const getBestGuess = (solution: IPuzzleSolution): number => {
  //   const totalWords = solution.availableWordIndexes.length;
  //   if (6 - solution.attempts >= totalWords || totalWords === 1) {
  //     return 0;
  //   } else if (totalWords < 10) {
  //     const words: Array<string> = [];
  //     solution.availableWordIndexes.forEach((wordIndex: number) => {
  //       words.push(dictionary.words[wordIndex]);
  //     });
  //     words.sort();
  //     const selectedWord = words[Math.ceil(words.length / 2)];
  //     const id = dictionary.words.indexOf(selectedWord);
  //     return solution.availableWordIndexes.indexOf(id === -1 ? 0 : id);
  //   }

  //   return Math.floor(solution.availableWordIndexes.length / 2);
  // };

  // const makeGuess = (
  //   puzzleSolution: IPuzzleSolution
  // ): Promise<IPuzzleSolution> => {
  //   return new Promise((resolve, reject) => {
  //     // let puzzleSolution: IPuzzleSolution = {
  //     //   ...initialGuess,
  //     //   displayColors: [],
  //     //   isFound: false,
  //     //   isCompleted: false,
  //     // };

  //     // while (!puzzleSolution.isCompleted) {
  //     if (puzzleSolution.attempts === 6 || puzzleSolution.isFound) {
  //       puzzleSolution.isCompleted = true;
  //     } else {
  //       puzzleSolution.attempts += 1;
  //       const startingWordIndex = allAvailableWords.indexOf(startingWord);
  //       const wordIndex =
  //         puzzleSolution.attempts === 1
  //           ? startingWordIndex
  //           : getBestGuess(puzzleSolution);
  //       const currentWordIndex = puzzleSolution.availableWordIndexes[wordIndex];
  //       const currentWord = dictionary.words[currentWordIndex];
  //       puzzleSolution.usedWords.push(currentWord);
  //       puzzleSolution.statInfoTracker += `${currentWord}(${puzzleSolution.availableWordIndexes.length})|`;

  //       puzzleSolution = getResults(puzzleSolution);
  //     }

  //     if (puzzleSolution.isCompleted && !puzzleSolution.isFound) {
  //       reject(puzzleSolution);
  //     } else {
  //       resolve(puzzleSolution);
  //     }
  //     // } else {
  //     //   reject(puzzleSolution);
  //     // }

  //     // }
  //   });
  // };

  return (
    <div ref={bodyContainerRef} className={`${styles.WordleVersusContainer}`}>
      <section itemID="wordleVsScoreComponent">
        <Score />
      </section>

      <section itemID="wordleVsWODSelectorDisplay">
        {isVisibleSelectWordForRobotDialog && SelectWordForRobotDialog}
      </section>

      <section itemID="startGameDisplay">
        {isVisibleStartGameDialog && StartGameDialog}
      </section>

      <section itemID="robotGameDisplay">
        <RobotSolver />
      </section>
      <WordleVersusGame />

      <section className={styles.DictionaryTrigger}>
        <WordleDictionaryOffcanvas />
      </section>
    </div>
  );
};

export default PuzzleWordleVersus;
