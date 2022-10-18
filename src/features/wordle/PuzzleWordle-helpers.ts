import { ILetterModel, IWordleDictionary } from './PuzzleWordle.types';

export const CHAR_OFFSET: number = 'A'.charCodeAt(0);
export const LOG_CLS_EVENT = 'color: #FF5733; font-weight: bold;';
export const LOG_CLS_WOD = 'color: #08A0BB; font-weight: lighter;';
export const LOG_CLS_MOBILE = 'color: #08A734; font-weight: bold;';
export const LOG_CLS_DESKTOP = 'color: #5624CF; font-weight: bold;';
export const LOG_CLS_INFO = 'color: #23232A;';
export const LOG_CLS_SUCCESS = 'color: #08A734;';
export const LOG_CLS_FAILURE = 'color: #FF5733;';
export const LOG_CLS_DATA = 'color: #0097ED;font-weight: 600;';


export const getIndexByLetterCode = (letter: string): number => letter.charCodeAt(0) - CHAR_OFFSET;

export const getLetterByIndexCode = (index: number): string => String.fromCharCode(index + CHAR_OFFSET);

// export const createDictionary = (listOfWords: Array<string>): IPuzzleDictionary => {
//   const wordsDictionary: IPuzzleDictionary = {
//     words: [],
//     letters: [],
//   };

//   listOfWords.forEach((word: string) => {
//     const wordIndex: number = wordsDictionary.words.push(word) - 1;
//     word.split('').forEach((charVal: string) => {
//       const letterCode = getIndexByLetterCode(charVal);
//       if (!Array.isArray(wordsDictionary.letters[letterCode])) {
//         wordsDictionary.letters[letterCode] = [];
//       }
//       wordsDictionary.letters[letterCode].push(wordIndex);

//       // if (wordsDictionary.letters[letterCode].indexOf(wordIndex) === -1) {
//       // }
//     });
//   });

//   return wordsDictionary;
// };

export const intersectionArray = (listA: Array<number>, listB: Array<number>): Array<number> => {
  if (!listA || !listB) {
    return listA || listB;
  }
  const returnList = listA.filter((wordIndex) => listB.indexOf(wordIndex) !== -1);
  return dedupeArray(returnList);
};

export const dedupeArray = (arrayList: Array<number>) => {
  const dedupedList: Array<number> = [];
  arrayList.forEach((wordIndex: number, index: number) => {
    if (arrayList.lastIndexOf(wordIndex) === index) {
      dedupedList.push(wordIndex);
    }
  });

  return dedupedList;
};

export const getExactMatches = (
  exactMatchLetter: Array<ILetterModel>,
  currentSolutionIndexes: Array<number>,
  dictionaryWords: IWordleDictionary
): Array<number> => {
  let solutionIndexes: Array<number> = currentSolutionIndexes;

  exactMatchLetter.forEach((letterMatch: ILetterModel) => {
    const letterCode = getIndexByLetterCode(letterMatch.letter);
    const filteredWordIndexes = dictionaryWords.letters[letterCode].filter(
      (wordIndex: number) => dictionaryWords.words[wordIndex].charAt(letterMatch.indexInWord) === letterMatch.letter
    );
    if (solutionIndexes.length === 0) {
      solutionIndexes = filteredWordIndexes;
    } else {
      solutionIndexes = intersectionArray(solutionIndexes, filteredWordIndexes);
    }
  });

  return solutionIndexes;
};

export const getExistsMatches = (
  existsMatchLetter: Array<ILetterModel>,
  exactMatchLetter: Array<ILetterModel>,
  nonExistentLetterAtIndex: Array<ILetterModel>,
  currentSolutionIndexes: Array<number>,
  dictionaryWords: IWordleDictionary
): Array<number> => {
  let solutionIndexes: Array<number> = currentSolutionIndexes;

  existsMatchLetter.forEach((matchedLetter: ILetterModel) => {
    const ml: string = matchedLetter.letter;
    const exactMatchCount = exactMatchLetter.filter((l) => ml === l.letter).length;
    const containsLetterInExactMatches = exactMatchCount > 0;
    const existMatchCount = existsMatchLetter.filter((l) => ml === l.letter).length;
    const containsMoreThanOneMatch = existMatchCount > 1;
    const containsNonExistentMatch = nonExistentLetterAtIndex.filter((l) => l.letter === ml).length > 0;
    const isMoreThanOne = containsMoreThanOneMatch || containsLetterInExactMatches;
    const indexInWord = matchedLetter.indexInWord;
    const letterCode = getIndexByLetterCode(ml);
    const availableWordIndexesForLetter: Array<number> = dictionaryWords.letters[letterCode].filter(
      (wordIndex: number) => {
        const fWord = dictionaryWords.words[wordIndex];
        if (isMoreThanOne) {
          if (containsNonExistentMatch) {
            const matches = fWord.matchAll(new RegExp(ml, 'g'));
            const letterCount = Array.from(matches).length;
            return (
              fWord.charAt(indexInWord) !== ml &&
              fWord.indexOf(ml) !== fWord.lastIndexOf(ml) &&
              letterCount === exactMatchCount + existMatchCount
            );
          }
          return fWord.charAt(indexInWord) !== ml && fWord.indexOf(ml) !== fWord.lastIndexOf(ml);
        }
        return fWord.charAt(indexInWord) !== ml;
      }
    );
    if (solutionIndexes.length === 0) {
      // solutionIndexes = dictionaryWords.letters[letterCode];
      solutionIndexes = availableWordIndexesForLetter;
    } else {
      solutionIndexes = intersectionArray(solutionIndexes, availableWordIndexesForLetter);
    }
  });

  return solutionIndexes;
};

export const removeNonExistentLetterIndexes = (
  nonExistentLetters: Array<string>,
  currentSolutionIndexes: Array<number>,
  dictionaryWords: IWordleDictionary
): Array<number> => {
  let solutionIndexes: Array<number> = currentSolutionIndexes;

  nonExistentLetters.forEach((letter) => {
    const letterIndex = getIndexByLetterCode(letter);
    const nonExistentWordIndexes: Array<number> = dictionaryWords.letters[letterIndex];
    solutionIndexes = solutionIndexes.filter((wordIndex: number) => nonExistentWordIndexes.indexOf(wordIndex) === -1);
  });

  return dedupeArray(solutionIndexes);
};

export const removeNonExistentLetterIndexesAtIndex = (
  nonExistentLettersAtIndex: Array<ILetterModel>,
  currentSolutionIndexes: Array<number>,
  dictionaryWords: IWordleDictionary
): Array<number> => {
  let solutionIndexes: Array<number> = currentSolutionIndexes;

  nonExistentLettersAtIndex.forEach((letterMatch: ILetterModel) => {
    const letterIndex = getIndexByLetterCode(letterMatch.letter);
    const nonExistentWordIndexes: Array<number> = dictionaryWords.letters[letterIndex].filter(
      (wordIndex: number) => dictionaryWords.words[wordIndex].charAt(letterMatch.indexInWord) !== letterMatch.letter
    );
    solutionIndexes = solutionIndexes.filter((wordIndex: number) => nonExistentWordIndexes.indexOf(wordIndex) !== -1);
  });

  return solutionIndexes;
};

export const processGuess = (guessWord: string, selectedWord: string) => {
  let selectedWordCopy = '';
  let guessWordCopy = '';

  if (guessWord === selectedWord) {
    return '22222';
  }

  for (let i = 0; i < guessWord.length; i++) {
    const currentLetter = guessWord.charAt(i);
    const selectedWordCurrentLetter = selectedWord.charAt(i);
    const isMatch = currentLetter === selectedWordCurrentLetter;
    const isMissingGuessLetter = !selectedWord.includes(currentLetter);
    const isMissingSelectedLetter = !guessWord.includes(selectedWordCurrentLetter);
    if (isMatch) {
      selectedWordCopy += '_';
      guessWordCopy += '2';
    } else {
      guessWordCopy += isMissingGuessLetter ? '0' : currentLetter;
      selectedWordCopy += isMissingSelectedLetter ? '_' : selectedWordCurrentLetter;
    }
  }

  console.log(
    `Guess: ${guessWord}, wod: ${selectedWord}, selected copy: ${selectedWordCopy}, guess copy: ${guessWordCopy}`
  );

  // const maxLength = Math.max(selectedWordCopy.length, guessWordCopy.length);
  for (let i = 0; i < guessWordCopy.length; i++) {
    const currentLetter = guessWordCopy.charAt(i);
    const isPresent = selectedWordCopy.includes(currentLetter);
    if (isPresent) {
      guessWordCopy = guessWordCopy.replace(currentLetter, '1');
      selectedWordCopy = selectedWordCopy.replace(currentLetter, '_');
    } else if (isNaN(parseInt(currentLetter))) {
      guessWordCopy = guessWordCopy.replace(currentLetter, '0');
    }
  }

  return guessWordCopy;
};

export const getVariantBySelectedMatchType = (selectedMatchType: string) => {
  return selectedMatchType === 'exact' ? 'success' : selectedMatchType === 'exists' ? 'warning' : 'outline-secondary';
};

export const getRandomWordFromDictionary = (dictionaryWords: IWordleDictionary) => {
  const len = dictionaryWords.words.length - 1;
  const randomIndex = Math.round(Math.random() * len);
  return dictionaryWords.words[randomIndex];
};

/**
 * Returns a sorted, deduped array of all available `words` in `dictionary` that begin with `letter`.
 * @param {string} letter first letter to filter the dictionary of all available `words`.
 * @param {IWordleDictionary} dictionary dictionary containing all available words
 *
 * @returns {Array<string>}
 */
// export const getWordsStartingWithLetter = (letter: string, dictionary: IWordleDictionary): ReadonlyArray<string> => {
//   const wordsContainingLetter = dedupeArray(dictionary.letters[getIndexByLetterCode(letter)]);
//   const wordsStartingWithLetter = wordsContainingLetter
//     .filter((wordIndex: number) => dictionary.words[wordIndex].charAt(0) === letter)
//     .map((wordIndex) => dictionary.words[wordIndex]);
  
//   wordsStartingWithLetter.sort();
//   return wordsStartingWithLetter;
// };

/**
 * Returns a sorted, deduped array of <=20 `words` in `dictionary` that begin with `letter`.
 * @param {string} letter first letter to filter the dictionary of all available `words`.
 * @param {IWordleDictionary} dictionary dictionary containing first <= 20 available words
 *
 * @returns {Array<string>}
 */
//  export const getPreviewStartingWithLetter = (letter: string, dictionary: IWordleDictionary): ReadonlyArray<string> => {
//   const wordsContainingLetter = dedupeArray(dictionary.letters[getIndexByLetterCode(letter)]).slice(0, 20);
//   const wordsStartingWithLetter = wordsContainingLetter
//     .filter((wordIndex: number) => dictionary.words[wordIndex].charAt(0) === letter)
//     .map((wordIndex) => dictionary.words[wordIndex]);
  
//   wordsStartingWithLetter.sort();
//   return wordsStartingWithLetter;
// };
