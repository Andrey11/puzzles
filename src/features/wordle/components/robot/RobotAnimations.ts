export type TAnimation = 'HideRobot' | 'ShowRobot' | 'LurkRobot' | 'VisibleRobot' | 'UnLurkRobot' | 'LurkRobot';

export type TAnimationMap<T> = { [animationName in TAnimation]: T };

export const OAnimationCls: TAnimationMap<string> = {
  HideRobot: 'robot--off',
  ShowRobot: 'robot--on',
  LurkRobot: 'robot--fullOn robot--halfDown',
  UnLurkRobot: 'robot--fullOn robot--halfUp',
  VisibleRobot: 'robot--fullOn',
} as const;

export interface IRobotAnimationFlow {
  /** scss cls name of this TAnimation */
  readonly animationCls: string;
  /** scss cls name of TAnimation for animating robot upwards */
  readonly up: string;
  /** scss cls name of TAnimation for animating robot downwards */
  readonly down: string;
}

export const RobotAnimation: TAnimationMap<IRobotAnimationFlow> = {
  HideRobot: {
    animationCls: OAnimationCls.HideRobot,
    down: OAnimationCls.HideRobot,
    up: OAnimationCls.ShowRobot,
  },
  ShowRobot: {
    animationCls: OAnimationCls.ShowRobot,
    down: OAnimationCls.HideRobot,
    up: OAnimationCls.VisibleRobot,
  },
  LurkRobot: {
    animationCls: OAnimationCls.LurkRobot,
    down: OAnimationCls.HideRobot,
    up: OAnimationCls.UnLurkRobot,
  },
  UnLurkRobot: {
    animationCls: OAnimationCls.UnLurkRobot,
    down: OAnimationCls.HideRobot,
    up: OAnimationCls.VisibleRobot,
  },
  VisibleRobot: {
    animationCls: OAnimationCls.VisibleRobot,
    down: OAnimationCls.LurkRobot,
    up: OAnimationCls.VisibleRobot,
  },
};

const getAnimationKeyByCls = (cls: string): TAnimation | undefined => {
  return (Object.keys(OAnimationCls) as (keyof typeof OAnimationCls)[]).find((key) => {
    return OAnimationCls[key] === cls;
  });
};

export const isHidden = (cls: string): boolean => cls === OAnimationCls.HideRobot;
export const isVisible = (cls: string): boolean => cls === OAnimationCls.VisibleRobot;
export const isAnimatedToVisible = (cls: string): boolean =>
  cls === OAnimationCls.ShowRobot || cls === OAnimationCls.UnLurkRobot;
export const getUpCls = (cls: string): string => {
  const animationKey = getAnimationKeyByCls(cls);
  return animationKey ? RobotAnimation[animationKey].up : OAnimationCls.VisibleRobot;
};
export const getDownCls = (cls: string): string => {
  const animationKey = getAnimationKeyByCls(cls);
  return animationKey ? RobotAnimation[animationKey].down : OAnimationCls.HideRobot;
};
