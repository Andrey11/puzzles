export const enum KEYBOARD_LETTERS {
  A = "A",
  B = "B",
  C = "C",
  D = "D",
  E = "E",
  F = "F",
  G = "G",
  H = "H",
  I = "I",
  J = "J",
  K = "K",
  L = "L",
  M = "M",
  N = "N",
  O = "O",
  P = "P",
  Q = "Q",
  R = "R",
  S = "S",
  T = "T",
  U = "U",
  V = "V",
  W = "W",
  X = "X",
  Y = "Y",
}

export const enum KEYBOARD_COLORS {
  GREEN = "GREEN",
  ORANGE = "ORANGE",
  GREY = "GREY",
}

export enum LETTER_COLORS {
  GREEN = 'success',
  GREEN_OUTLINE = 'outline-success',
  ORANGE = 'warning',
  ORANGE_OUTLINE = 'outline-warning',
  GREY = 'secondary',
  GREY_OUTLINE = 'outline-secondary',
}

export type KeyboardColor = keyof typeof KEYBOARD_COLORS;
export type KeyboardLetter = keyof typeof KEYBOARD_LETTERS;
export type KeyboardLetterColor = keyof typeof LETTER_COLORS;

export interface ILetterKey {
  letter: KeyboardLetter;
  letterColor: KeyboardLetterColor;
  disabled?: boolean;
  checked?: boolean;
  mobileMode?: boolean;
}

export interface IPuzzlesKeyboardState {
  keyboardColor: KeyboardColor;
  letters: Record<KeyboardLetter, ILetterKey>;
  showDeleteKey?: boolean;
  showEnterKey?: boolean;
  showClearKey?: boolean;
  enabled?: boolean;
  visible?: boolean;
}
