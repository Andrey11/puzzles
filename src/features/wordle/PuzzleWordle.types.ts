import React from "react";

export const MATCH_TYPE_EXACT = "exact";
export const MATCH_TYPE_EXISTS = "exists";
export const MATCH_TYPE_MISSING = "missing";
export const MATCH_TYPE_NONE = "none";

export const OMatchType = {
  EXACT: 'exact',
  EXISTS: 'exists',
  MISSING: 'missing',
  NONE: 'none',
} as const;

export declare type MatchType =
  | "exact"
  | "exists"
  | "missing"
  | "none"
  | string;

export declare type WordleStatus = "idle" | "loading" | "failed" | "loaded";

export enum WordleScreen {
  SOLVER = "0",
  ANALYZER = "1",
  DICTIONARY = "2",
}

export enum ROUND_IDS {
  ROUND_1 = 1,
  ROUND_2,
  ROUND_3,
  ROUND_4,
  ROUND_5,
  ROUND_6,
}

export type RoundKey = keyof typeof ROUND_IDS;


export interface IGameRoundState {
  roundId: ROUND_IDS;
  guessWord: Array<string>;
  isValidWord?: boolean;
}

export interface IWordleGameState {
  wod: string;
  currentRound: RoundKey;
  rounds: Record<RoundKey, IGameRoundState>;
  isUserGame: boolean;
  isWon?: boolean;
  isLost?: boolean;
}

export type Letters =|"A"|"B"|"C"|"D"|"E"|"F"|"G"|"H"|"I"|"J"|"K"|"L"|"M"|"N"|"O"|"P"|"Q"|"R"|"S"|"T"|"U"|"V"|"W"|"X"|"Y"|"Z";
  
export interface IWordleDictionaryState {
  activeLetter: string;
}

export interface IWordleState {
  activeScreen: WordleScreen;
  status: WordleStatus;
  shouldShowRobot: boolean;
  shouldShowSelectSolverWordsOverlay: boolean;
  shouldShowEndSolverGameOverlay: boolean;
}

export interface ILetterModel {
  letter: string;
  indexInWord: number;
}

export interface ILetterInWord extends ILetterModel {
  exactMatch: boolean;
  existsInWord: boolean;
}

export interface IGuessModel {
  guessNumber: number;
  guessWord: string;
  guessWordDictionaryIndex: number;
  isMatch?: boolean;
}

export interface ISolutionModel {
  currentWordIndex: number;
  availableWordIndexes: Array<number>;
  attempts: number;
  matchedLetters: Array<string>;
  existsMatchLetter: Array<ILetterModel>;
  exactMatchLetter: Array<ILetterModel>;
  nonExistentLetters: Array<string>;
  nonExistentLetterAtIndex: Array<ILetterModel>;
  usedWordIndexes: Array<number>;
  usedWords: Array<string>;
}

export interface IWordleSolution extends ISolutionModel {
  isFound: boolean;
  isCompleted: boolean;
  displayColors: Array<string>;
  statInfoTracker: string;
  wod?: string;
}

export interface ConsoleLogStyle {
  cmpName: string;
  cmpNameCls: string;
  msgCls: string;
  dataCls: string;
  actionCls: string;
  successCls: string;
  failCls: string;
  logMsg: (msg: string, msgStyle: string) => Array<string>;
  logSuccess: (msg: string) => Array<string>;
  logAction: (msg: string) => Array<string>;
  logData: (msg: string) => Array<string>;
  logFail: (msg: string) => Array<string>;
}

/**
 * Represents an object with
 * @property key = charCode
 */
export interface ILettersInWords {
  [key: number]: Array<number>;
}

export interface IWordleRow {
  letters: Array<string>;
  colors: Array<string>;
  disabled?: boolean;
}

export interface IWordleDictionary {
  words: Array<string>;
  letters: ILettersInWords;
  wordsBy: Record<Letters, Array<string>>;
}

export interface IGuesses {
  guess1: IWordleRow;
  guess2: IWordleRow;
  guess3: IWordleRow;
  guess4: IWordleRow;
  guess5: IWordleRow;
  guess6: IWordleRow;
}

export interface IStatCounter {
  wod: string;
  wordGuesses: Array<string>;
  isFound: boolean;
  totalAttempts: number;
  indexCounts: Array<number>;
}

export interface IStat {
  status: string;
  wod: string;
  guesses: string;
}

export interface IMatchType {
  type: string;
  label: JSX.Element | React.ReactNode;
  variant: string;
}

export interface IRadioGroupProps {
  onChange: (matchType: string) => void;
  matchTypes: Array<IMatchType>;
  selectedType: string;
}
export interface IAnalyzerData {
  existsMatchLetter?: Array<ILetterModel>;
  exactMatchLetter?: Array<ILetterModel>;
  nonExistentLetters?: Array<string>;
  shouldAnalyze?: boolean;
}

export interface ISelectedLetter {
  position: number;
  letter: string;
  matchType: string;
}
export interface ISelectedLetters {
  spots: Array<ISelectedLetter>;
}

/**
 *
 * xxs: 0   < width <= 320
 * xs:  320 < width <= 375
 * s:   375 < width <= 425
 * m:   425 < width <  768
 * l:   768 <= width <= 1024
 * xl  1024 < width <= ...
 */
export const DEVICE_WIDTH_XXS = "xxs";
export const DEVICE_WIDTH_XS = "xs";
export const DEVICE_WIDTH_S = "s";
export const DEVICE_WIDTH_M = "m";
export const DEVICE_WIDTH_L = "l";
export const DEVICE_WIDTH_XL = "xl";

export type DeviceWidthSize =
  | typeof DEVICE_WIDTH_XXS
  | typeof DEVICE_WIDTH_XS
  | typeof DEVICE_WIDTH_S
  | typeof DEVICE_WIDTH_M
  | typeof DEVICE_WIDTH_L
  | typeof DEVICE_WIDTH_XL;

/**
   * 
   * [
  {
    "word": "tesla",
    "phonetic": "/ˈtɛslə/",
    "phonetics": [
      {
        "text": "/ˈtɛslə/",
        "audio": "https://api.dictionaryapi.dev/media/pronunciations/en/tesla-us.mp3",
        "sourceUrl": "https://commons.wikimedia.org/w/index.php?curid=1161581",
        "license": {
          "name": "BY-SA 3.0",
          "url": "https://creativecommons.org/licenses/by-sa/3.0"
        }
      }
    ],
    "meanings": [
      {
        "partOfSpeech": "noun",
        "definitions": [
          {
            "definition": "In the International System of Units, the derived unit of magnetic flux density or magnetic inductivity. Symbol: T",
            "synonyms": [],
            "antonyms": []
          }
        ],
        "synonyms": [],
        "antonyms": []
      }
    ],
    "license": {
      "name": "CC BY-SA 3.0",
      "url": "https://creativecommons.org/licenses/by-sa/3.0"
    },
    "sourceUrls": [
      "https://en.wiktionary.org/wiki/tesla"
    ]
  }
]

*/

interface ILicense {
  name: string;
  url: string;
}

interface IPhonetic {
  text: string;
  audio: string;
  sourceUrl: string;
  license: ILicense;
}

interface IDefinition {
  definition: string;
  synonyms: Array<string>;
  antonyms: Array<string>;
}
interface IWordMeaning {
  partOfSpeech: string;
  definitions: Array<IDefinition>;
  synonyms: Array<string>;
  antonyms: Array<string>;
}
export interface IWordDefinition {
  word: string;
  phonetic: string;
  phonetics: Array<IPhonetic>;
  meanings: Array<IWordMeaning>;
  license: ILicense;
  sourceUrls: Array<string>;
  isError: boolean;
}

export interface IWordsDefinitions {
  [key: number]: IWordDefinition;
}

export type WordDefinitionCallback = (lookup: IWordDefinition) => void;
