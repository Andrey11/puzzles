export const UfoMovementState = {
  Enter: 'Enter',
  Exit: 'Exit',
  Idle: 'Idle',
} as const;

export type UfoMovementStateT = (typeof UfoMovementState)[keyof typeof UfoMovementState];

export const UfoSpaceshipLidOpenCloseState = {
  Open: 'Open',
  Close: 'Close',
} as const;

export type UfoSpaceshipLidOpenCloseStateT =
  (typeof UfoSpaceshipLidOpenCloseState)[keyof typeof UfoSpaceshipLidOpenCloseState];

export const HeadVisibility = {
  Visible: 'Visible',
  Hidden: 'Hidden',
  Peeking: 'Peeking',
} as const;

export type HeadVisibilityT = (typeof HeadVisibility)[keyof typeof HeadVisibility];

export const MouthState = {
  Neutral: 'Neutral',
  Talking: 'Talking',
  Smiling: 'Smiling',
  Frown: 'Frown',
  Surprised: 'Surprised',
} as const;

export type MouthStateT = (typeof MouthState)[keyof typeof MouthState];

export type EyesExpression = 'neutral' | 'happy' | 'angry' | 'sad';
export const EyeState = {
  idle: 'idle',
  blinking: 'blinking',
  winking: 'winking',
  surprised: 'surprised',
  angry: 'angry',
  sad: 'sad',
} as const;

export type EyeStateT = (typeof EyeState)[keyof typeof EyeState];
