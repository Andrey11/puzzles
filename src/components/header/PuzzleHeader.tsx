import React from 'react';
import * as Icon from 'react-bootstrap-icons';
import {
  getHeaderItems,
  getHeaderTitle,
  isShowHeaderDictionaryIcon,
  setHeaderItemAction,
} from 'app/appSlice';
import { useAppDispatch, useAppSelector } from 'app/hooks/hooks';
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
  // const rightSectionItems = userAppSelection(getRightSectionItems);
  // const middleSectionItems = userAppSelection(getRightSectionItems);
  // const leftSectionItems = userAppSelection(getRightSectionItems);

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
                {
                  <ItemIcon
                    className={styles.Item}
                    onClick={() => onCallback(action)}
                  />
                }
              </section>
            );
          })}
      </>
    );
  };

  return (
    <header itemID="AppHeaderDisplay" className={styles.PuzzleHeader}>
      <section
        itemID="LeftSection"
        className={`${styles.Items} ${styles.Left}`}
      >
        {renderHeaderItems('LEFT')}
      </section>
      <section
        itemID="CenterSection"
        className={`${styles.Items} ${styles.Middle}`}
      >
        <span>{headerTitle}</span>
      </section>
      <section
        itemID="RightSection"
        className={`${styles.Items} ${styles.Right}`}
      >
        {isDictionaryIconVisible && (
          <section
            itemID="DictionaryDisplay"
            className={styles.DictionaryTrigger}
          >
            <WordleDictionaryOffcanvas />
          </section>
        )}
        {renderHeaderItems('RIGHT')}
      </section>
    </header>
  );
};

export default PuzzleHeader;
