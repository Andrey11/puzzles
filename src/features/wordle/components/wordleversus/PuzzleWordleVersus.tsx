import React, { useEffect, useMemo, useRef, useState } from "react";
import { SelectInstance } from "react-select";

import { Robot } from "react-bootstrap-icons";

import {
  getExactMatches,
  getExistsMatches,
  removeNonExistentLetterIndexes,
  removeNonExistentLetterIndexesAtIndex,
} from "../../PuzzleWordle-helpers";
import {
  ILetterModel,
  IWordleDictionary,
  IPuzzleSolution,
  IStat,
  ISolutionModel,
} from "../../PuzzleWordle.types";

import styles from "./PuzzleWordleVersus.module.scss";

import WordSelector from "../dropdown/WordSelector";
import { allAvailableWords } from "../../PuzzleWords";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks/hooks";
import {
  createDictionary,
  getDictionary,
  isDictionaryLoaded,
} from "../../wordleSlice";
import { PuzzleType } from "../../../../app/App.types";
import { setActivePuzzle } from "../../../../app/appSlice";
import {
  addLetter,
  deleteLetter,
  getBotWordle,
  isUserTurn,
  onSubmitUserGuess,
  setGuessWordValid,
} from "./wordleVersusSlice";
import NotificationOverlay from "../notification/NotificationOverlay";
import RowGroup from "../rowgroup/RowGroup";
import PuzzlesKeyboard from "../../../../components/keyboard/PuzzlesKeyboard";

type IPuzzleWordleVersusProps = {
  games?: number;
};

const NON_BREAKING_SPACE: JSX.Element = <>&nbsp;</>;

// const initialPuzzleRowModel: IWordleRow = {
//   letters: ["", "", "", "", ""],
//   colors: [
//     "transparent",
//     "transparent",
//     "transparent",
//     "transparent",
//     "transparent",
//   ],
//   disabled: true,
// };

const START_WORD = "OCEAN";

const initialSolutionModel = (): ISolutionModel => {
  return {
    currentWordIndex: 0,
    attempts: 0,
    matchedLetters: [],
    existsMatchLetter: [],
    nonExistentLetters: [],
    nonExistentLetterAtIndex: [],
    usedWordIndexes: [],
    exactMatchLetter: [],
    usedWords: [],
    availableWordIndexes: Array.from(Array(allAvailableWords.length).keys()),
  };
};

const PuzzleWordleVersus: React.FunctionComponent<IPuzzleWordleVersusProps> = ({
  games = 1,
}: IPuzzleWordleVersusProps) => {
  const selectRef = useRef<SelectInstance | null>();
  // const startingWordRef = useRef<SelectInstance | null>();
  const wordRunnerRef = useRef<number>(0);
  const targetRef = useRef(null);
  const guessRowTargetRef = useRef(null);

  const dictionaryLoaded = useAppSelector(isDictionaryLoaded);
  const dictionary: IWordleDictionary = useAppSelector(getDictionary);
  const dispatch = useAppDispatch();

  // const { isMobile } = useDeviceDetect();

  // const [dictionaryLetters, setDictionaryLetters] = useState<Array<number>>([]);

  // const [guess1, setGuess1] = useState<IWordleRow>(initialPuzzleRowModel);
  // const [guess2, setGuess2] = useState<IWordleRow>(initialPuzzleRowModel);
  // const [guess3, setGuess3] = useState<IWordleRow>(initialPuzzleRowModel);
  // const [guess4, setGuess4] = useState<IWordleRow>(initialPuzzleRowModel);
  // const [guess5, setGuess5] = useState<IWordleRow>(initialPuzzleRowModel);
  // const [guess6, setGuess6] = useState<IWordleRow>(initialPuzzleRowModel);

  const [selectedWord, setSelectedWord] = useState<string>("");
  const [startingWord, setStartingWord] = useState<string>("");
  const [statTracker, setStatTracker] = useState<Array<IStat>>([]);
  const [loaded, setLoaded] = useState<boolean>(dictionaryLoaded);

  // const currentGuessNumber = useAppSelector(getCurrentUserGuess);
  const userGuessTurn = useAppSelector(isUserTurn);
  const botWord = useAppSelector(getBotWordle);
  // const animateInvalidWord = useAppSelector(showInvalidWordAnimation);

  const [guessingInProgress, setGuessingInProgress] = useState<boolean>(false);

  useEffect(() => {
    if (!loaded) {
      console.log("[PuzzleWordleVersus] initialized");
      setLoaded(true);
      dispatch(createDictionary(allAvailableWords));
      dispatch(setActivePuzzle(PuzzleType.WORDLE_VERSUS));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  useEffect(() => {
    if (dictionaryLoaded && dictionary.words.length > 0) {
      // setDictionaryLetters(dictionary.letters as unknown as Array<number>);
      setStartingWord(START_WORD);
    }
  }, [dictionaryLoaded, dictionary]);

  useEffect(() => {
    if (selectedWord !== "") {
      solveWordlePuzzle(selectedWord);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWord]);

  useEffect(() => {
    if (userGuessTurn) {
      console.log(`User turn, botWordle = ${botWord}`);
    }
  }, [userGuessTurn, botWord]);

  const puzzleSolver = async (startPuzzleSolution: IPuzzleSolution) => {
    let puzzleSolution: IPuzzleSolution = startPuzzleSolution;

    while (!puzzleSolution.isCompleted) {
      const guessResultPromise: Promise<IPuzzleSolution> =
        makeGuess(startPuzzleSolution);
      await guessResultPromise
        // eslint-disable-next-line no-loop-func
        .then((lastGuessSolution: IPuzzleSolution) => {
          puzzleSolution = lastGuessSolution;
        })
        // eslint-disable-next-line no-loop-func
        .catch((lastGuessSolutionError: IPuzzleSolution) => {
          puzzleSolution = lastGuessSolutionError;
        })
        // eslint-disable-next-line no-loop-func
        .finally(() => {
          const hasWords =
            puzzleSolution.usedWords && puzzleSolution.usedWords.length > 0;
          const guessIndex: number = hasWords
            ? puzzleSolution.usedWords.length - 1
            : -1;
          const lastWord: string = hasWords
            ? puzzleSolution.usedWords[guessIndex]
            : "";
          displayStatus(
            puzzleSolution.attempts,
            puzzleSolution.displayColors,
            lastWord
          );
        });
    }

    return puzzleSolution;
  };

  const solveWordlePuzzle = (wod: string): Promise<IPuzzleSolution> => {
    const puzzleSolution: IPuzzleSolution = {
      ...initialSolutionModel(),
      displayColors: [],
      isFound: false,
      isCompleted: false,
      statInfoTracker: "",
    };

    const solutionPromise: Promise<IPuzzleSolution> = new Promise(
      async (resolve, reject) => {
        const resultSolution = await puzzleSolver(puzzleSolution);

        if (resultSolution.isCompleted && resultSolution.isFound) {
          resolve(resultSolution);
        } else {
          reject(resultSolution);
        }
      }
    );

    let solverSolution: IPuzzleSolution = puzzleSolution;

    solutionPromise
      .then((value: IPuzzleSolution) => {
        // console.log(`${wordRunnerRef.current}\tPASS: ${wod} guesses ${value.usedWords.toString()}`);
        solverSolution = value;
      })
      .catch((value: IPuzzleSolution) => {
        // console.log(`${wordRunnerRef.current}\tFAIL: ${wod} guesses ${value.usedWords.toString()}`);
        solverSolution = value;
      })
      .finally(() => {
        const successStyle = "color: green; font-weight: bold;";
        const failuerStyle = "color: red; font-weight: bold;";
        const wodStyle = "color: blue; font-weight: lighter;";
        const solutionStyle = "color: #555555; font-weight: lighter;";
        const resultStyle = solverSolution.isFound
          ? successStyle
          : failuerStyle;
        const statusText = solverSolution.isFound ? "%cPASS" : "%cFAIL";
        const stats = {
          status: statusText,
          wod: wod,
          guesses: solverSolution.statInfoTracker,
        };

        let statTrak: Array<IStat> = [];
        if (statTracker) {
          statTrak = statTracker;
        }
        statTrak.push(stats);
        setStatTracker(statTrak);
        console.log(
          `${wordRunnerRef.current}\t${statusText}: %c${wod} %c${solverSolution.statInfoTracker}`,
          resultStyle,
          wodStyle,
          solutionStyle
        );

        const exactSpots = solverSolution.exactMatchLetter || [];
        const existSpots = solverSolution.existsMatchLetter || [];
        const nonExistent = solverSolution.nonExistentLetters || [];
        const exactStr = exactSpots
          .map((s) => `{let: ${s.letter}, pos: ${s.indexInWord}}`)
          .join(",");
        const existsStr = existSpots
          .map((s) => `{let: ${s.letter}, pos: ${s.indexInWord}}`)
          .join(", ");
        console.log(
          `Analyze Solution: exact: ${exactStr}, exists: ${existsStr}, miss: ${nonExistent.toString()}`
        );
        setGuessingInProgress(false);
      });

    return solutionPromise;
  };

  const selectableWords = useMemo(() => {
    return dictionary.words.map((word: string) => ({
      value: word,
      label: word,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dictionaryLoaded]);

  const displayStatus = (
    guessNum: number,
    colors: Array<string> = ["green", "green", "green", "green", "green"],
    letter: string
  ) => {
    if (guessNum === 1) {
      // setGuess1({ letters: letter.split(""), colors: colors });
    } else if (guessNum === 2) {
      // setGuess2({ letters: letter.split(""), colors: colors });
    } else if (guessNum === 3) {
      // setGuess3({ letters: letter.split(""), colors: colors });
    } else if (guessNum === 4) {
      // setGuess4({ letters: letter.split(""), colors: colors });
    } else if (guessNum === 5) {
      // setGuess5({ letters: letter.split(""), colors: colors });
    } else if (guessNum === 6) {
      // setGuess6({ letters: letter.split(""), colors: colors });
    }
    // console.log(`Guess: ${guessNum}, ${letter}, ${colors}`);
  };

  const getResults = (solution: IPuzzleSolution): IPuzzleSolution => {
    const attemptNum = solution.attempts;
    const lastGuess = solution.usedWords[attemptNum - 1];
    let wod = "";
    const resultStatus: Array<number> = [0, 0, 0, 0, 0];
    if (lastGuess === selectedWord) {
      // console.log(`PASS: wod: ${selectedWord}, guesses (${attemptNum}) = ${solution.usedWords}`);
      solution.displayColors = ["green", "green", "green", "green", "green"];
      solution.exactMatchLetter = lastGuess
        .split("")
        .map((l, index) => ({ letter: l, indexInWord: index }));
      solution.existsMatchLetter = [];
      solution.isFound = true;
      return solution;
    } else {
      const colors: Array<string> = [];
      const nonExistentLetterAtIndex: Array<ILetterModel> =
        solution.nonExistentLetterAtIndex;
      const matchedLetters: Array<string> = []; //solution.matchedLetters;
      const existsMatchLetters: Array<ILetterModel> = []; //solution.existsMatchLetter;
      const exactMatches: Array<string> = []; //solution.exactMatchLetter.map((exactMatch) => {
      const exactMatchLetters: Array<ILetterModel> = []; //solution.exactMatchLetter;
      const nonExistentLetters: Array<string> = solution.nonExistentLetters;

      lastGuess.split("").forEach((letter: string, index: number) => {
        if (letter === selectedWord.charAt(index)) {
          wod = wod.concat("2");
          resultStatus[index] = 2;
          exactMatches.push(letter);
          exactMatchLetters.push({ letter: letter, indexInWord: index });
        } else {
          wod = wod.concat(selectedWord[index]);
        }
      });

      lastGuess.split("").forEach((letter: string, index: number) => {
        if ("2" === wod.charAt(index)) {
          colors.push("green");
        } else if (wod.indexOf(letter) !== -1) {
          wod = wod.replace(letter, "1");
          resultStatus[index] = 1;
          matchedLetters.push(letter);
          existsMatchLetters.push({ letter: letter, indexInWord: index });
          colors.push("orange");
        } else {
          colors.push("grey");
          // letter does not exist in WOD
          if (
            matchedLetters.indexOf(letter) === -1 &&
            exactMatches.indexOf(letter) === -1
          ) {
            if (!nonExistentLetters.includes(letter)) {
              nonExistentLetters.push(letter);
            }
            // WOD contains multiple instances of a letter
          } else if (
            exactMatches.indexOf(letter) !== -1 &&
            matchedLetters.indexOf(letter) === -1
          ) {
            const exactMatchesForLetter = exactMatchLetters
              .filter((ml: ILetterModel) => ml.letter === letter)
              .map((val: ILetterModel) => val.indexInWord);
            selectedWord.split("").forEach((l: string, letterIndex: number) => {
              if (!exactMatchesForLetter.includes(letterIndex)) {
                nonExistentLetterAtIndex.push({
                  letter: letter,
                  indexInWord: letterIndex,
                });
              }
            });
            // letter exists in WOD, but in a different spot
          } else {
            nonExistentLetterAtIndex.push({
              letter: letter,
              indexInWord: index,
            });
          }
        }
      });

      // displayStatus(attemptNum, colors, lastGuess);
      solution.displayColors = colors;
      solution.exactMatchLetter = exactMatchLetters;
      solution.matchedLetters = matchedLetters;
      solution.existsMatchLetter = existsMatchLetters;
      solution.nonExistentLetters = nonExistentLetters;
      solution.nonExistentLetterAtIndex = nonExistentLetterAtIndex;
      // console.log(`ResultStatus: ${resultStatus.toString()}`);
      return getNextIndex(solution);
    }
  };

  const getNextIndex = (solution: IPuzzleSolution): IPuzzleSolution => {
    let currentWordIndexes: Array<number> = [...solution.availableWordIndexes];
    const {
      exactMatchLetter,
      existsMatchLetter,
      nonExistentLetterAtIndex,
      nonExistentLetters,
    } = solution;

    currentWordIndexes = getExactMatches(
      exactMatchLetter,
      currentWordIndexes,
      dictionary
    );
    currentWordIndexes = getExistsMatches(
      existsMatchLetter,
      exactMatchLetter,
      nonExistentLetterAtIndex,
      currentWordIndexes,
      dictionary
    );
    currentWordIndexes = removeNonExistentLetterIndexes(
      nonExistentLetters,
      currentWordIndexes,
      dictionary
    );
    currentWordIndexes = removeNonExistentLetterIndexesAtIndex(
      nonExistentLetterAtIndex,
      currentWordIndexes,
      dictionary
    );

    const aIndex = currentWordIndexes[0];
    solution.currentWordIndex =
      currentWordIndexes[aIndex] || solution.currentWordIndex + 1;
    solution.availableWordIndexes = currentWordIndexes;
    // console.log(`Available guesses: ${solution.availableWordIndexes.length}`);
    return solution;
  };

  const getBestGuess = (solution: IPuzzleSolution): number => {
    const totalWords = solution.availableWordIndexes.length;
    if (6 - solution.attempts >= totalWords || totalWords === 1) {
      return 0;
    } else if (totalWords < 10) {
      const words: Array<string> = [];
      solution.availableWordIndexes.forEach((wordIndex: number) => {
        words.push(dictionary.words[wordIndex]);
      });
      words.sort();
      const selectedWord = words[Math.ceil(words.length / 2)];
      const id = dictionary.words.indexOf(selectedWord);
      return solution.availableWordIndexes.indexOf(id === -1 ? 0 : id);
    }

    return Math.floor(solution.availableWordIndexes.length / 2);
  };

  const makeGuess = (
    puzzleSolution: IPuzzleSolution
  ): Promise<IPuzzleSolution> => {
    return new Promise((resolve, reject) => {
      // let puzzleSolution: IPuzzleSolution = {
      //   ...initialGuess,
      //   displayColors: [],
      //   isFound: false,
      //   isCompleted: false,
      // };

      // while (!puzzleSolution.isCompleted) {
      if (puzzleSolution.attempts === 6 || puzzleSolution.isFound) {
        puzzleSolution.isCompleted = true;
      } else {
        puzzleSolution.attempts += 1;
        const startingWordIndex = allAvailableWords.indexOf(startingWord);
        const wordIndex =
          puzzleSolution.attempts === 1
            ? startingWordIndex
            : getBestGuess(puzzleSolution);
        const currentWordIndex = puzzleSolution.availableWordIndexes[wordIndex];
        const currentWord = dictionary.words[currentWordIndex];
        puzzleSolution.usedWords.push(currentWord);
        puzzleSolution.statInfoTracker += `${currentWord}(${puzzleSolution.availableWordIndexes.length})|`;

        puzzleSolution = getResults(puzzleSolution);
      }

      if (puzzleSolution.isCompleted && !puzzleSolution.isFound) {
        reject(puzzleSolution);
      } else {
        resolve(puzzleSolution);
      }
      // } else {
      //   reject(puzzleSolution);
      // }

      // }
    });
  };

  const clearAllGuessRows = () => {
    // TODO: Reset all guesses
    // setGuess1({ ...initialPuzzleRowModel });
    // setGuess2({ ...initialPuzzleRowModel });
    // setGuess3({ ...initialPuzzleRowModel });
    // setGuess4({ ...initialPuzzleRowModel });
    // setGuess5({ ...initialPuzzleRowModel });
    // setGuess6({ ...initialPuzzleRowModel });
  };

  // const clearPuzzle = () => {
  //   clearAllGuessRows();
  //   // setGuesses([]);
  //   wordRunnerRef.current = 0;
  //   setGuessingInProgress(false);
  //   selectRef.current?.clearValue();
  //   startingWordRef.current?.setValue(
  //     { value: START_WORD, label: START_WORD },
  //     "select-option"
  //   );
  // };

  const onEnterPressed = (event?: Event) => {
    console.log(`Enter pressed`);
    dispatch(setGuessWordValid(true));
    dispatch(onSubmitUserGuess());
  };

  const onDeletePressed = (event?: Event) => {
    const kbEvent = event as KeyboardEvent;
    if (kbEvent && kbEvent.key !== "Backspace") {
      return;
    }
    dispatch(deleteLetter());
  };

  const onWordSelected = (selectedWord: string) => {
    clearAllGuessRows();
    setGuessingInProgress(selectedWord !== "");
    if (startingWord !== "") {
      displayStatus(
        1,
        [
          "transparent",
          "transparent",
          "transparent",
          "transparent",
          "transparent",
        ],
        startingWord
      );
    }

    setSelectedWord(selectedWord);
  };

  const handleLetterChange = (letter: string) => {
    console.log(`Letter change: ${letter} ${guessingInProgress}`);
    dispatch(addLetter(letter));
  };

  // const deleteButton = (
  //   <Button
  //     key="delete-btn"
  //     variant="outline-danger"
  //     active={false}
  //     onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
  //       event.stopPropagation();
  //       if (!isMobile) {
  //         event.currentTarget.blur();
  //         onDeletePressed();
  //         console.log("Click Delete event");
  //       }
  //     }}
  //     onTouchEnd={(event: React.TouchEvent<HTMLButtonElement>) => {
  //       event.stopPropagation();
  //       if (isMobile) {
  //         event.currentTarget.blur();
  //         onDeletePressed();
  //       }
  //     }}
  //     className={styles.DeleteButton}
  //   >
  //     <Backspace size={18} />
  //   </Button>
  // );

  // const enterButton = (
  //   <Button
  //     key="enter-btn"
  //     variant="outline-success"
  //     active={false}
  //     value={1}
  //     onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
  //       event.stopPropagation();
  //       if (!isMobile) {
  //         event.currentTarget.blur();
  //         onEnterPressed();
  //         console.log("Click Enter event");
  //       }
  //     }}
  //     onTouchEnd={(event: React.TouchEvent<HTMLButtonElement>) => {
  //       event.stopPropagation();
  //       if (isMobile) {
  //         event.currentTarget.blur();
  //         onEnterPressed();
  //         console.log("Touch Enter event");
  //       }
  //     }}
  //     className={styles.EnterButton}
  //   >
  //     <BoxArrowRight size={18} />
  //   </Button>
  // );

  // const renderLetterButtons = () => {
  //   if (!dictionaryLetters || !dictionary) {
  //     return null;
  //   }

  //   const stateVariant = "outline-secondary";
  //   const selectedMissingLetterVariant = "secondary";

  //   const letterElements: Array<JSX.Element> = dictionaryLetters.map(
  //     (liw: any, index: number) => {
  //       const letter: string = getLetterByIndexCode(index);
  //       const letterId = `letter_${letter}`;
  //       const isSelectedMissingLetter = false;
  //       const currentVariant = isSelectedMissingLetter
  //         ? selectedMissingLetterVariant
  //         : stateVariant;
  //       return (
  //         <section key={`key_${letterId}`}>
  //           <ToggleButton
  //             className={styles.LetterButton}
  //             checked={isSelectedMissingLetter}
  //             variant={currentVariant}
  //             active={false}
  //             onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
  //               event.stopPropagation();
  //               if (!isMobile) {
  //                 event.currentTarget.blur();
  //                 handleLetterChange(letter);
  //                 console.log("Click event");
  //               }
  //             }}
  //             onTouchEnd={(event: React.TouchEvent<HTMLButtonElement>) => {
  //               event.stopPropagation();
  //               if (isMobile) {
  //                 event.currentTarget.blur();
  //                 handleLetterChange(letter);
  //                 console.log("Touch event");
  //               }
  //             }}
  //             value={letter}
  //           >
  //             {letter}
  //           </ToggleButton>
  //         </section>
  //       );
  //     }
  //   );

  //   const allLetters = letterElements.slice(0, letterElements.length - 2);
  //   allLetters.push(enterButton);
  //   allLetters.push(<div key="letter_spacer1" className={styles.Spacer}></div>);
  //   allLetters.push(...letterElements.slice(letterElements.length - 2));
  //   allLetters.push(<div key="letter_spacer2" className={styles.Spacer}></div>);
  //   allLetters.push(deleteButton);

  //   return allLetters;
  // };

  return (
    <div className={`${styles.WordleVersusContainer}`}>
      <section className={styles.ScoreDisplay}>GAME SCORE</section>
      <section>
        <div className={styles.ControlContainer}>
          {dictionaryLoaded && !userGuessTurn && (
            <WordSelector
              refContainer={targetRef}
              refSelector={selectRef}
              words={selectableWords}
              onWordSelected={onWordSelected}
              placeholder={
                <span className={styles.PlaceholderMessage}>
                  Enter wordle for{NON_BREAKING_SPACE}
                  <span>
                    <Robot size={24} />
                  </span>
                  {NON_BREAKING_SPACE} to solve
                </span>
              }
            />
          )}
          {dictionaryLoaded && userGuessTurn && (
            <div>Solve wordle bot's word {botWord}</div>
          )}
          <div
            ref={guessRowTargetRef}
            className={`${styles.RelativePosition} ${styles.GuessContainer}`}
          >
            <RowGroup />
          </div>
        </div>
      </section>
      <section>
        <div className={styles.StatsContainer}>
          {/* {dictionaryLoaded && renderLetterButtons()} */}
          <PuzzlesKeyboard
            onKeyPressed={handleLetterChange}
            onDeletePressed={onDeletePressed}
            onEnterPressed={onEnterPressed}
          />
        </div>
      </section>
      <NotificationOverlay targetRef={guessRowTargetRef} />

      {/* <Button id="clear-btn" variant="secondary" size="lg" onClick={clearPuzzle}>
        CLEAR
      </Button> */}
    </div>
  );
};

export default PuzzleWordleVersus;
