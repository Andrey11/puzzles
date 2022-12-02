import React from 'react';
import { useAppDispatch, useAppSelector } from 'app/hooks/hooks';
import useDeviceDetect from 'app/hooks/useDeviceDetect';
import * as Icon from 'react-bootstrap-icons';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { getHeaderItems, getHeaderTitle, isShowHeaderDictionaryIcon, setHeaderItemAction } from 'app/appSlice';
import WordleDictionaryOffcanvas from 'features/wordle/components/dictionary/WordleDictionaryOffcanvas';

import styles from './PuzzleHeader.module.scss';

export type ItemAction = 'ACTION_BACK' | 'ACTION_SETTINGS' | 'ACTION_HELP' | '';
export type TPosition = 'LEFT' | 'MIDDLE' | 'RIGHT';

export interface IHeaderItem {
  itemId: string;
  itemTitle: string;
  itemPosition: TPosition;
  isButton: boolean;
  isIcon: boolean;
  iconName?: string;
  icon?: string;
  tooltipText?: string;
  onClickCallback?: (agrs: any) => void;
  itemAction?: ItemAction;
}

const getIconByName = (name: string | undefined): Icon.Icon => {
  let icon: Icon.Icon;
  switch (name) {
    case 'GearFill':
      icon = Icon.GearFill;
      break;
    case 'QuestionCircle':
      icon = Icon.QuestionCircle;
      break;
    case 'Back':
      icon = Icon.Back;
      break;
    case 'PuzzleFill':
      icon = Icon.PuzzleFill;
      break;
    default:
      icon = Icon['Puzzle'] as Icon.Icon;
  }
  return icon;
};

const PuzzleHeader: React.FC = () => {
  const dispatch = useAppDispatch();
  const headerTitle = useAppSelector(getHeaderTitle);
  const headerItems: Array<IHeaderItem> = useAppSelector(getHeaderItems);
  const isDictionaryIconVisible = useAppSelector(isShowHeaderDictionaryIcon);

  const { isMobile } = useDeviceDetect();

  const onCallback = (ia: ItemAction) => dispatch(setHeaderItemAction(ia));

  const renderHeaderItems = (position: TPosition): JSX.Element => {
    return (
      <>
        {headerItems
          .filter((item: IHeaderItem) => item.itemPosition === position)
          .map((item) => {
            const ItemIcon: Icon.Icon = getIconByName(item.iconName);
            const action = item.itemAction || 'ACTION_HELP';
            return (
              <section key={item.itemId}>
                <OverlayTrigger placement='auto' overlay={<Tooltip id={`tooltip-${item.itemId}`}>Tooltip!</Tooltip>}>
                <span className="d-inline-block">
                <ItemIcon
                    className={styles.Item}
                    onClick={() => onCallback(action)}
                  />
                </span>
                </OverlayTrigger>
              </section>
            );
          })}
      </>
    );
  };

  const getLettersForWord = (word: string, letterCls: string, prefix: string): Array<JSX.Element> => {
    if (isMobile) {
      return [<span key={`${prefix}`} className={letterCls}>{word}</span>];
    }

    return word.split('').map((letter: string, index: number) => {
      return (
        <span key={`$${prefix}_${index}_${letter}`} className={`${styles.CellLetter} ${letterCls}`}>
          {letter}
        </span>
      );
    });
  };

  const renderHeaderTitle = (title: string): Array<JSX.Element> => {
    const titleArray = title.split(' ');
    let headerTitle: Array<JSX.Element> = [];

    titleArray.forEach((word: string, index: number) => {
      let fillCls = index === 0 ? styles.Match : styles.ExactMatch;
      let letterElsForWord = getLettersForWord(word, fillCls, `${index}_${word}`);
      headerTitle.push(...letterElsForWord);
      headerTitle.push(<span key={`${index}_${word}_SPACER`}>&nbsp;&nbsp;</span>);
    });

    return headerTitle;
  };

  // const renderHeaderMobileTitle = (title: string): Array<JSX.Element> => {
  //   const titleArray = title.split(' ');
  //   let headerTitle: Array<JSX.Element> = [];

  //   titleArray.forEach((word: string, index: number) => {
  //     let fillCls = index === 0 ? styles.OrangeText : styles.GreenText;
  //     headerTitle.push(<span key={`${index}_${word}`} className={fillCls}>{word}</span>);
  //     headerTitle.push(<span key={`${index}_${word}_SPACER`}>&nbsp;&nbsp;</span>);
  //   });

  //   return headerTitle;
  // };

  return (
    <header itemID="AppHeaderDisplay" className={styles.PuzzleHeader}>
      <section itemID="LeftSection" className={`${styles.Items} ${styles.Left}`}>
        {renderHeaderItems('LEFT')}
      </section>
      <section itemID="CenterSection" className={`${styles.Items} ${styles.Middle}`}>
        {renderHeaderTitle(headerTitle)}
      </section>
      <section itemID="RightSection" className={`${styles.Items} ${styles.Right}`}>
        {isDictionaryIconVisible && (
          <section itemID="DictionaryDisplay" className={styles.DictionaryTrigger}>
            <WordleDictionaryOffcanvas />
          </section>
        )}
        {renderHeaderItems('RIGHT')}
      </section>
    </header>
  );
};

export default PuzzleHeader;
