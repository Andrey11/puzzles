import React, { useEffect, useMemo, useRef, useState } from 'react';

import { getLogStyles } from '../PuzzleWordle-helpers';

import styles from './PuzzleWordleVersus.module.scss';

import { useAppDispatch, useAppSelector } from '../../../app/hooks/hooks';
import { PUZZLES } from '../../../app/App.types';
import {
  getActivePuzzle,
  isHeaderItemActionByType,
  setActivePuzzle,
  setHeaderItemAction,
  setHeaderItems,
  setHeaderTitle,
  setShowHeaderDictionaryIcon,
} from '../../../app/appSlice';
import UserWordSelector from './components/wordleselector/UserWordSelector';
import { useDialog } from '../components/modal/Dialog';
import { Joystick, PencilSquare } from 'react-bootstrap-icons';
import WordleVersusGame from './game/WordleVersusGame';
import {
  isLostGame,
  isUserGame,
  isWonGame,
} from './game/wordleVersusGameSlice';
import {
  getMaxGames,
  isMatchFinished,
  isMatchStarted,
  isUserWinner,
  setMaxGames,
  setShouldPickWod,
  startWordleVersusMatch,
  startWordleVersusNextGame,
} from './wordleVersusSlice';
import Score from '../components/score/Score';
import {
  createDictionary,
  getDictionaryStatus,
  isDictionaryLoaded,
} from '../components/dictionary/wordleDictionarySlice';
import WordleVersusGameSettings from './components/roundselector/GameSettingsSelector';
import RobotSolver from './game/robot/RobotSolver';
import EndGameSettings from './components/endgame/EndGameSettings';
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

  const isSettingsHeaderAction = useSelector((state: RootState) =>
    isHeaderItemActionByType(state, 'ACTION_SETTINGS')
  );
  const isHelpHeaderAction = useSelector((state: RootState) =>
    isHeaderItemActionByType(state, 'ACTION_HELP')
  );

  const [isInit, setIsInit] = useState<boolean>(false);
  const [selectedWord, setSelectedWord] = useState<string>('');

  const isWon = useAppSelector(isWonGame);
  const isLost = useAppSelector(isLostGame);
  const userWonMatch = useAppSelector(isUserWinner);
  const matchFinished = useAppSelector(isMatchFinished);
  const matchStarted = useAppSelector(isMatchStarted);
  const userGame = useAppSelector(isUserGame);


  const startNewMatch = () => {
    dispatch(startWordleVersusMatch());
    dispatch(setShouldPickWod(true));
  };

  // Select word for Robot dialog
  const {
    DialogComponent: SelectWordForRobotDialog,
    setDialogVisible: setVisibleSelectWordForRobotDialog,
  } = useDialog({
    title: 'Enter guess word for Robot',
    body: <UserWordSelector onWordSelected={setSelectedWord} />,
    infoTrigger: <PencilSquare size={18} />,
    onCloseDialogCallback: () => {
      if (selectedWord) {
        dispatch(startWordleVersusNextGame(selectedWord));
      }
    },
  });
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
        defaultSelected={
          maxGames === 2
            ? 'inline-radio-1'
            : maxGames === 6
            ? 'inline-radio-2'
            : 'inline-radio-3'
        }
      />
    ),
    actionButtonLabel: 'Start New Match',
    infoTrigger: <></>,
    onCloseDialogCallback: () => {
      startNewMatch();
    },
  });
  // End game dialog
  const {
    DialogComponent: EndGameDialog,
    setDialogVisible: setVisibleEndGameDialog,
    dialogVisible: isVisibleEndGameDialog,
  } = useDialog({
    title: 'Game Over',
    body: <EndGameSettings winner={userWonMatch ? 'User' : 'Robot'} />,
    actionButtonLabel: 'Play Again',
    cancelButtonLabel: 'No',
    showCancelButton: true,
    infoTrigger: <Joystick size={18} />,
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
      console.log(
        ...WordleVsLog.logAction('help button in header was pressed')
      );
    }
  }, [
    dispatch,
    isHelpHeaderAction,
    isSettingsHeaderAction,
    isVisibleGameSettingsDialog,
    setVisibleGameSettingsDialog,
  ]);

  /** START GAME STATE / DICTIONARY LOADED EFFECT */
  useEffect(() => {
    if (!dictionaryLoaded && dictionaryStatus !== 'loaded' && isInit) {
      dispatch(createDictionary());
      console.log(...WordleVsLog.logAction('creating wordle dictionary'));
    } else if (dictionaryLoaded && dictionaryStatus === 'loaded' && isInit) {
      console.log(...WordleVsLog.logSuccess('wordle dictionary loaded'));
      dispatch(setShowHeaderDictionaryIcon(true));
    }
  }, [
    dictionaryLoaded,
    dictionaryStatus,
    dispatch,
    isInit,
    // setVisibleGameSettingsDialog,
  ]);

  /** END TURN (aka GAME/ROUND) EFFECT */
  useEffect(() => {
    if (!matchFinished && (isWon || isLost)) {
      let timeoutId: NodeJS.Timeout;
      if (userGame) {
        timeoutId = setTimeout(() => {
          setVisibleSelectWordForRobotDialog(true);
        }, 2000);
      } else {
        timeoutId = setTimeout(() => {
          console.log(
            ...WordleVsLog.logSuccess('asking Robot to pick guess word')
          );
          dispatch(setShouldPickWod(true));
        }, 2000);
      }

      return () => clearTimeout(timeoutId);
    }
  }, [
    dispatch,
    isLost,
    isWon,
    matchFinished,
    setVisibleSelectWordForRobotDialog,
    userGame,
  ]);

  /** END MATCH EFFECT */
  useEffect(() => {
    if (matchFinished) {
      console.log(
        ...WordleVsLog.logSuccess('match finished, show end game dialog')
      );
      const timeoutId = setTimeout(() => {
        setVisibleEndGameDialog(true);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [matchFinished, setVisibleEndGameDialog]);

  const showWordSelectorForRobotTrigger = useMemo(() => {
    return !matchFinished && (isWon || isLost) && userGame;
  }, [isLost, isWon, matchFinished, userGame]);

  const showStartMatchTrigger = useMemo(() => {
    return dictionaryLoaded && dictionaryStatus === 'loaded' && isInit && !matchStarted;
  }, [dictionaryLoaded, dictionaryStatus, isInit, matchStarted]);

  return (
    <div ref={bodyContainerRef} className={styles.WordleVersusContainer}>
      <section itemID="GameScoreDisplay">
        <Score />
      </section>

      <section itemID="GameWordSelectorDisplay">
        {showWordSelectorForRobotTrigger && SelectWordForRobotDialog}
      </section>

      <section
        className={styles.GameSettingsDisplayTrigger}
        itemID="GameSettingsDisplay"
      >
        {GameSettingsDialog}
      </section>

      <section itemID="EndGameDisplay">
        {isVisibleEndGameDialog && EndGameDialog}
      </section>

      <section itemID="RobotGameDisplay" className={styles.RobotDisplay}>
        <RobotSolver />
      </section>

      <section itemID="GameBoardWithKeyboardDisplay">
        <WordleVersusGame />
      </section>

      <section itemID="GameStartDisplay">
        {showStartMatchTrigger && !isVisibleEndGameDialog && (
          <div className={styles.StartGameDisplay} onClick={startNewMatch}>Start Match</div>
        )}
      </section>
{/* 
      <section itemID="SelectGuessWordForRobotDisplay">
        {!matchStarted && (
          <div className={styles.StartGameDisplay} onClick={startNewMatch}>Start Match</div>
        )}
      </section> */}

      
    </div>
  );
};

export default PuzzleWordleVersus;
