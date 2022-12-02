import React, { useEffect, useRef, useState } from 'react';

import { getLogStyles } from '../PuzzleWordle-helpers';

import styles from './PuzzleWordleVersus.module.scss';

import { useAppDispatch, useAppSelector } from 'app/hooks/hooks';
import { PUZZLES } from 'app/App.types';
import {
  getActivePuzzle,
  isHeaderItemActionByType,
  setActivePuzzle,
  setHeaderItemAction,
  setHeaderItems,
  setHeaderTitle,
  setShowHeaderDictionaryIcon,
} from '../../../app/appSlice';
import { useDialog } from '../components/modal/Dialog';
import WordleVersusGame from './game/WordleVersusGame';
import { addWord, isLostGame, isUserGame, isWonGame, onSubmitGuess } from './game/wordleVersusGameSlice';
import {
  getMaxGames,
  isMatchFinished,
  isMatchStarted,
  setMaxGames,
  setShouldPickWod,
  setShouldShowEndMatchOverlay,
  setShouldShowSelectWordOverlay,
  setShouldShowStartMatchOverlay,
  shouldRobotSolvePuzzle,
  startWordleVersusMatch,
} from './wordleVersusSlice';
import Score from '../components/score/Score';
import {
  createDictionary,
  getDictionaryStatus,
  isDictionaryLoaded,
} from '../components/dictionary/wordleDictionarySlice';
import WordleVersusGameSettings from './components/roundselector/GameSettingsSelector';
import RobotSolver from '../components/robot/RobotSolver';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { IHeaderItem } from '../../../components/header/PuzzleHeader';

type IPuzzleWordleVersusProps = {
  games?: number;
};

const WordleVsLog = getLogStyles({
  cmpName: 'PuzzleWordleVersus',
  cmpNameCls: 'color: #fd8008; font-weight: bold;',
});

const WordleVsHeaderSettings: Array<IHeaderItem> = [
  {
    itemTitle: 'Back to Puzzles',
    itemId: 'BackButton',
    itemPosition: 'LEFT',
    iconName: 'PuzzleFill',
    isButton: false,
    isIcon: true,
    icon: 'PuzzleFill',
    itemAction: 'ACTION_BACK',
  },
  {
    itemTitle: 'Settings',
    itemId: 'SettingsButton',
    itemPosition: 'RIGHT',
    iconName: 'GearFill',
    isButton: false,
    isIcon: true,
    icon: 'GearFill',
    itemAction: 'ACTION_SETTINGS',
  },
  {
    itemTitle: 'Help',
    itemId: 'HelpButton',
    itemPosition: 'RIGHT',
    iconName: 'QuestionCircle',
    isButton: false,
    isIcon: true,
    icon: 'QuestionCircle',
    itemAction: 'ACTION_HELP',
  },
];

const PuzzleWordleVersus: React.FunctionComponent<IPuzzleWordleVersusProps> = ({
  games = 1,
}: IPuzzleWordleVersusProps) => {
  const bodyContainerRef = useRef(null);
  const dispatch = useAppDispatch();

  const dictionaryLoaded = useAppSelector(isDictionaryLoaded);
  const dictionaryStatus = useAppSelector(getDictionaryStatus);
  const activePuzzle = useAppSelector(getActivePuzzle);
  const maxGames = useAppSelector(getMaxGames);

  const isSettingsHeaderAction = useSelector((state: RootState) => isHeaderItemActionByType(state, 'ACTION_SETTINGS'));
  const isHelpHeaderAction = useSelector((state: RootState) => isHeaderItemActionByType(state, 'ACTION_HELP'));

  const [isInit, setIsInit] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);

  const isWon = useAppSelector(isWonGame);
  const isLost = useAppSelector(isLostGame);
  const matchFinished = useAppSelector(isMatchFinished);
  const matchStarted = useAppSelector(isMatchStarted);
  const userGame = useAppSelector(isUserGame);
  const shouldSolvePuzzle = useAppSelector(shouldRobotSolvePuzzle);

  const startNewMatch = () => {
    dispatch(startWordleVersusMatch());
    dispatch(setShouldPickWod(true));
  };

  // Game settings dialog
  const {
    DialogComponent: GameSettingsDialog,
    setDialogVisible: setVisibleGameSettingsDialog,
    dialogVisible: isVisibleGameSettingsDialog,
  } = useDialog({
    title: 'Wordle Versus Settings',
    body: (
      <WordleVersusGameSettings
        onRoundsSelected={(rounds) => {
          dispatch(setMaxGames(rounds));
        }}
        defaultSelected={maxGames === 2 ? 'inline-radio-1' : maxGames === 6 ? 'inline-radio-2' : 'inline-radio-3'}
      />
    ),
    actionButtonLabel: 'Start New Match',
    infoTrigger: <></>,
    onCloseDialogCallback: () => {
      startNewMatch();
    },
  });

  /** PUZZLE ACTIVATION ON LOAD EFFECT */
  useEffect(() => {
    if (!isInit) {
      setIsInit(true);
      // console.log(...WordleVsLog.logSuccess('initializing'));
    } else if (isInit && activePuzzle !== PUZZLES.WORDLE_VERSUS) {
      dispatch(setActivePuzzle(PUZZLES.WORDLE_VERSUS));
      dispatch(setHeaderTitle('Wordle Versus'));
      dispatch(setHeaderItems(WordleVsHeaderSettings));
      console.log(...WordleVsLog.logAction('activating wordle versus'));
    }
  }, [isInit, activePuzzle, dispatch]);

  /** HEADER ACTION HANDLERS EFFECT */
  useEffect(() => {
    if (isSettingsHeaderAction && !isVisibleGameSettingsDialog) {
      dispatch(setHeaderItemAction(''));
      setVisibleGameSettingsDialog(true);
    } else if (isHelpHeaderAction) {
      console.log(...WordleVsLog.logAction('help button in header was pressed'));
    }
  }, [dispatch, isHelpHeaderAction, isSettingsHeaderAction, isVisibleGameSettingsDialog, setVisibleGameSettingsDialog]);

  /** LOAD DICTIONARY AND SHOW ON HEADER EFFECT */
  useEffect(() => {
    if (!dictionaryLoaded && dictionaryStatus !== 'loaded' && isInit) {
      dispatch(createDictionary());
      console.log(...WordleVsLog.logAction('creating wordle dictionary'));
    } else if (dictionaryLoaded && dictionaryStatus === 'loaded' && isInit) {
      console.log(...WordleVsLog.logSuccess('wordle dictionary loaded'));
      dispatch(setShowHeaderDictionaryIcon(true));
      setIsReady(true);
    }
  }, [dictionaryLoaded, dictionaryStatus, dispatch, isInit]);

  /** END TURN (aka GAME/ROUND) EFFECT */
  useEffect(() => {
    if (!isReady) return;

    if (!matchFinished && (isWon || isLost)) {
      let timeoutId: NodeJS.Timeout;
      if (userGame) {
        timeoutId = setTimeout(() => {
          dispatch(setShouldShowSelectWordOverlay(true));
        }, 2000);
      } else {
        timeoutId = setTimeout(() => {
          console.log(...WordleVsLog.logSuccess('asking Robot to pick guess word'));
          dispatch(setShouldPickWod(true));
        }, 2000);
      }

      return () => clearTimeout(timeoutId);
    }
  }, [dispatch, isReady, isLost, isWon, matchFinished, userGame]);

  /** END MATCH EFFECT */
  useEffect(() => {
    if (!isReady) return;
    
    let timeoutId: NodeJS.Timeout;
    if (matchFinished) {
      console.log(...WordleVsLog.logSuccess('match finished, show EoG dialog'));
      timeoutId = setTimeout(() => {
        dispatch(setShouldShowEndMatchOverlay(true));
      }, 2500);
    } else if (!matchStarted && !matchFinished) {
      console.log(...WordleVsLog.logSuccess('match finished false and match started false'));
      dispatch(setShouldShowStartMatchOverlay(true));
    }

    return () => clearTimeout(timeoutId);
  }, [dispatch, isReady, matchFinished, matchStarted]);

  return (
    <div ref={bodyContainerRef} className={styles.WordleVersusContainer}>
      <section itemID="GameScoreDisplay">
        <Score />
      </section>

      <section className={styles.GameSettingsDisplayTrigger} itemID="GameSettingsDisplay">
        {GameSettingsDialog}
      </section>

      <section itemID="RobotGameDisplay" className={styles.RobotDisplay}>
        <RobotSolver
          onRobotGuessWord={addWord}
          shouldSolvePuzzle={shouldSolvePuzzle}
          isLost={isLost}
          isWon={isWon}
          onSubmitGuess={onSubmitGuess}
        />
      </section>

      <section itemID="GameBoardWithKeyboardDisplay">
        <WordleVersusGame isInit={isReady}/>
      </section>
    </div>
  );
};

export default PuzzleWordleVersus;
