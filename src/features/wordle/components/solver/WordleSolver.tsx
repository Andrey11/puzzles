import React, { useEffect, useMemo, useRef, useState } from "react";
import { SelectInstance } from "react-select";

import Button from "react-bootstrap/Button";
import { Robot, InfoSquare, PencilSquare } from "react-bootstrap-icons";

import {
  getExactMatches,
  getExistsMatches,
  getRandomWordFromDictionary,
  removeNonExistentLetterIndexes,
  removeNonExistentLetterIndexesAtIndex,
} from "../../PuzzleWordle-helpers";
import {
  IAnalyzerData,
  ILetterModel,
  IWordleRow,
  IWordleSolution,
  IStat,
  ISolutionModel,
} from "../../PuzzleWordle.types";

import styles from "./WordleSolver.module.scss";

import WordSelector from "../dropdown/WordSelector";
import { useOverlay } from "../overlay/InfoOverlay";
import { allAvailableWords } from "../../PuzzleWords";
import { useAppSelector } from "../../../../app/hooks/hooks";
import { getDictionary, isDictionaryLoaded } from "../dictionary/wordleDictionarySlice";

type IPuzzleWordleSolverProps = {
  analyzeSolutionHandler?: (solution: IAnalyzerData) => void;
};

const NON_BREAKING_SPACE: JSX.Element = <>&nbsp;</>;

const initialPuzzleRowModel: IWordleRow = {
  letters: ["", "", "", "", ""],
  colors: [
    "transparent",
    "transparent",
    "transparent",
    "transparent",
    "transparent",
  ],
};

const MAX_RUNNER_TIMES = 20;
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

const WordleSolver: React.FunctionComponent<
  IPuzzleWordleSolverProps
> = ({ analyzeSolutionHandler = () => {} }: IPuzzleWordleSolverProps) => {
  const selectRef = useRef<SelectInstance | null>();
  const startingWordRef = useRef<SelectInstance | null>();
  const wordRunnerRef = useRef<number>(0);
  const calculateBtnRef = useRef<HTMLButtonElement | null>();
  const targetRef = useRef(null);
  const bodyContainerRef = useRef(null);
  const guessRowTargetRef = useRef(null);

  const dictionary = useAppSelector(getDictionary);
  const dictionaryLoaded = useAppSelector(isDictionaryLoaded);


  /** Letters not to appear in possible word matches */
  const [guess1, setGuess1] = useState<IWordleRow>(
    initialPuzzleRowModel
  );
  const [guess2, setGuess2] = useState<IWordleRow>(
    initialPuzzleRowModel
  );
  const [guess3, setGuess3] = useState<IWordleRow>(
    initialPuzzleRowModel
  );
  const [guess4, setGuess4] = useState<IWordleRow>(
    initialPuzzleRowModel
  );
  const [guess5, setGuess5] = useState<IWordleRow>(
    initialPuzzleRowModel
  );
  const [guess6, setGuess6] = useState<IWordleRow>(
    initialPuzzleRowModel
  );

  const [selectedWord, setSelectedWord] = useState<string>("");
  const [startingWord, setStartingWord] = useState<string>(START_WORD);
  const [randomStartingWord, setRandomStartingWord] = useState<boolean>(false);
  const [runnerCount, setRunnerCount] = useState<number>(1);
  const [statTracker, setStatTracker] = useState<Array<IStat>>([]);

  const [guessingInProgress, setGuessingInProgress] = useState<boolean>(false);

  const [analyzerData, setAnalyzerData] = useState<IAnalyzerData>({});
  const [lastSolution, setLastSolution] = useState<IWordleSolution>();

  useEffect(() => {
    if (dictionaryLoaded && dictionary.words.length > 0) {
      onManualFirstWordSelected(START_WORD);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dictionaryLoaded, dictionary]);

  useEffect(() => {
    if (selectedWord !== "") {
      solveWordlePuzzle(selectedWord);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWord]);

  useEffect(() => {
    if (!guessingInProgress && wordRunnerRef.current > 0) {
      wordRunner();
    } else if (guessingInProgress && selectedWord !== "") {
      // console.log('calling make guess');
      // makeGuess(initialSolutionModel());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guessingInProgress]);

  useEffect(() => {
    if (
      wordRunnerRef.current !== 0 &&
      wordRunnerRef.current + MAX_RUNNER_TIMES >= MAX_RUNNER_TIMES * runnerCount
    ) {
      // if (wordRunnerRef.current < 83) {
      if (calculateBtnRef.current && calculateBtnRef.current.onclick) {
        calculateBtnRef.current.click();
      }
    }
  }, [runnerCount]);

  const puzzleSolver = async (startPuzzleSolution: IWordleSolution) => {
    let puzzleSolution: IWordleSolution = startPuzzleSolution;

    while (!puzzleSolution.isCompleted) {
      const guessResultPromise: Promise<IWordleSolution> =
        makeGuess(startPuzzleSolution);
      await guessResultPromise
        // eslint-disable-next-line no-loop-func
        .then((lastGuessSolution: IWordleSolution) => {
          puzzleSolution = lastGuessSolution;
        })
        // eslint-disable-next-line no-loop-func
        .catch((lastGuessSolutionError: IWordleSolution) => {
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

  const solveWordlePuzzle = (wod: string): Promise<IWordleSolution> => {
    const puzzleSolution: IWordleSolution = {
      ...initialSolutionModel(),
      displayColors: [],
      isFound: false,
      isCompleted: false,
      statInfoTracker: "",
      wod: '',
    };

    const solutionPromise: Promise<IWordleSolution> = new Promise(
      async (resolve, reject) => {
        const resultSolution = await puzzleSolver(puzzleSolution);

        if (resultSolution.isCompleted && resultSolution.isFound) {
          resolve(resultSolution);
        } else {
          reject(resultSolution);
        }
      }
    );

    let solverSolution: IWordleSolution = puzzleSolution;

    solutionPromise
      .then((value: IWordleSolution) => {
        // console.log(`${wordRunnerRef.current}\tPASS: ${wod} guesses ${value.usedWords.toString()}`);
        solverSolution = value;
      })
      .catch((value: IWordleSolution) => {
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
        setLastSolution(solverSolution);
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
      setGuess1({ letters: letter.split(""), colors: colors });
    } else if (guessNum === 2) {
      setGuess2({ letters: letter.split(""), colors: colors });
    } else if (guessNum === 3) {
      setGuess3({ letters: letter.split(""), colors: colors });
    } else if (guessNum === 4) {
      setGuess4({ letters: letter.split(""), colors: colors });
    } else if (guessNum === 5) {
      setGuess5({ letters: letter.split(""), colors: colors });
    } else if (guessNum === 6) {
      setGuess6({ letters: letter.split(""), colors: colors });
    }
    // console.log(`Guess: ${guessNum}, ${letter}, ${colors}`);
  };

  const getResults = (solution: IWordleSolution): IWordleSolution => {
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

  const getNextIndex = (solution: IWordleSolution): IWordleSolution => {
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

  const getBestGuess = (solution: IWordleSolution): number => {
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
    puzzleSolution: IWordleSolution
  ): Promise<IWordleSolution> => {
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
    setGuess1({ ...initialPuzzleRowModel });
    setGuess2({ ...initialPuzzleRowModel });
    setGuess3({ ...initialPuzzleRowModel });
    setGuess4({ ...initialPuzzleRowModel });
    setGuess5({ ...initialPuzzleRowModel });
    setGuess6({ ...initialPuzzleRowModel });
  };

  const clearPuzzle = () => {
    clearAllGuessRows();
    // setGuesses([]);
    wordRunnerRef.current = 0;
    setRunnerCount(1);
    setGuessingInProgress(false);
    selectRef.current?.clearValue();
    setRunnerCount(0);
    startingWordRef.current?.setValue(
      { value: START_WORD, label: START_WORD },
      "select-option"
    );
  };

  const onStartingWordSelected = (selectedWord: string) => {
    clearAllGuessRows();
    if (selectedWord !== "") {
      selectRef.current?.setValue("", "select-option");
      setStartingWord(selectedWord);
      displayStatus(
        1,
        [
          "transparent",
          "transparent",
          "transparent",
          "transparent",
          "transparent",
        ],
        selectedWord
      );
    }
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

  const wordRunner = () => {
    if (
      wordRunnerRef.current < dictionary.words.length &&
      wordRunnerRef.current < MAX_RUNNER_TIMES * runnerCount
    ) {
      selectRef.current?.setValue(
        selectableWords.at(wordRunnerRef.current),
        "select-option"
      );
      wordRunnerRef.current += 1;
    } else if (wordRunnerRef.current >= dictionary.words.length) {
      // end reached
    } else if (MAX_RUNNER_TIMES > runnerCount) {
      setRunnerCount(runnerCount + 1);
    } else if (MAX_RUNNER_TIMES <= runnerCount) {
      // console.table(statTracker);
    }

    return;
  };

  const analyzeWord = () => {
    console.log(`Clicked Analyze: ${analyzerData}`);
    const solution: IAnalyzerData = { ...analyzerData };
    if (lastSolution) {
      solution.exactMatchLetter = [...lastSolution.exactMatchLetter];
      solution.existsMatchLetter = [...lastSolution.existsMatchLetter];
      solution.nonExistentLetters = [...lastSolution.nonExistentLetters];
      solution.shouldAnalyze = true;
      setAnalyzerData({
        exactMatchLetter: [...lastSolution.exactMatchLetter],
        existsMatchLetter: [...lastSolution.existsMatchLetter],
        nonExistentLetters: [...lastSolution.nonExistentLetters],
        shouldAnalyze: true,
      });
    }

    analyzeSolutionHandler(solution);
  };

  const onRandomFirstWordClicked = () => {
    setRandomStartingWord(true);
    onStartingWordSelected(getRandomWordFromDictionary(dictionary));
    setOverlayVisible(false);
  };

  const onManualFirstWordSelected = (selectedWord: string) => {
    if (selectedWord !== "") {
      setRandomStartingWord(false);
      onStartingWordSelected(selectedWord);
      setOverlayVisible(false);
    }
  };

  const { OverlayComponent: InfoTip } = useOverlay({
    componentRef: bodyContainerRef,
    targetRef: targetRef,
    infoTrigger: <InfoSquare size={18} />,
  });

  const { OverlayComponent: SelectFirstWord, setOverlayVisible } = useOverlay({
    componentRef: bodyContainerRef,
    targetRef: guessRowTargetRef,
    placement: "top",
    title: "Enter word as first guess",
    body: (
      <div className={styles.SelectStartingWordOverlay}>
        <WordSelector
          words={selectableWords}
          onWordSelected={onManualFirstWordSelected}
          placeholder={"Enter starting guess word"}
          refSelector={startingWordRef}
          autoFocus={false}
        />
        <Button
          size="sm"
          onClick={onRandomFirstWordClicked}
          variant={randomStartingWord ? "primary" : "outline-primary"}
        >
          RANDOM
        </Button>
      </div>
    ),
    infoTrigger: <PencilSquare size={18} />,
  });

  return (
    <div className={`${styles.PuzzleDetailSolver} ${styles.DisplayContainer}`}>
      <div className={styles.ControlContainer}>
        <div className={styles.InfoPosition}>{InfoTip}</div>

        {dictionaryLoaded && (
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
        <div
          ref={guessRowTargetRef}
          className={`${styles.RelativePosition} ${styles.GuessContainer}`}
        >
          <div className={styles.EditFirstWordPopup}>{SelectFirstWord}</div>
          {/* <WordleRow rowId={ROW_IDS.ROW_1} guess={guess1} rowNumber={1}/>
          <WordleRow rowId={ROW_IDS.ROW_2} guess={guess2} rowNumber={2}/>
          <WordleRow rowId={ROW_IDS.ROW_3} guess={guess3} rowNumber={3}/>
          <WordleRow rowId={ROW_IDS.ROW_4} guess={guess4} rowNumber={4}/>
          <WordleRow rowId={ROW_IDS.ROW_5} guess={guess5} rowNumber={5}/>
          <WordleRow rowId={ROW_IDS.ROW_6} guess={guess6} rowNumber={6}/> */}
        </div>
        <Button
          ref={(ref: any) => (calculateBtnRef.current = ref)}
          variant="primary"
          size="sm"
          disabled={guessingInProgress}
          onClick={wordRunner}
        >
          {guessingInProgress ? "SOLIVNG..." : "ACTIVATE WORD RUNNER"}
        </Button>
        <Button
          ref={(ref: any) => (calculateBtnRef.current = ref)}
          variant="info"
          size="sm"
          disabled={false}
          onClick={analyzeWord}
        >
          {"ANALYZE WORD GUESS"}
        </Button>
        <Button variant="secondary" size="lg" onClick={clearPuzzle}>
          CLEAR
        </Button>
      </div>
    </div>
  );
};

export default WordleSolver;
