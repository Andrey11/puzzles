import React from 'react';
import { Icon, Robot } from 'react-bootstrap-icons';
import styles from './Placeholder.module.scss';

export const NON_BREAKING_SPACE: React.JSX.Element = <>&nbsp;</>;
const NBSP: React.JSX.Element = <>&nbsp;</>;

type PlaceholderProps = {
  PlaceholderIcon: Icon;
  placeholderText: string;
};

const Placeholder: React.FC<PlaceholderProps> = ({ PlaceholderIcon, placeholderText }: PlaceholderProps) => {
  const IconElement = (
    <>
      {NBSP}
      <span>
        <PlaceholderIcon size={24} />
      </span>
      {NBSP}
    </>
  );

  return (
    <span className={styles.PlaceholderIcon}>
      {placeholderText}
      {IconElement}
    </span>
  );
};

type UsePlaceholderProps = {
  icon?: Icon;
  placeholderText?: string;
};

const usePlaceholder = (props: UsePlaceholderProps) => {
  const PIcon: Icon = props.icon || Robot;
  const plText = props.placeholderText || 'Enter wordle for';

  const PlaceholderWithIcon = <Placeholder PlaceholderIcon={PIcon} placeholderText={plText} />;

  return {
    PlaceholderWithIcon,
  };
};

export { Placeholder as default, usePlaceholder };
