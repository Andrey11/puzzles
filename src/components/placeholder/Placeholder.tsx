import React from "react";
import { Icon, Robot } from "react-bootstrap-icons";

import styles from './Placeholder.module.scss';

export const NON_BREAKING_SPACE: JSX.Element = <>&nbsp;</>;
const NBSP: JSX.Element = <>&nbsp;</>;

type PlaceholderProps = {
  PlaceholderIcon: Icon, 
  placeholerText: string
}

const Placeholder:React.FC<PlaceholderProps> = ({PlaceholderIcon, placeholerText} : PlaceholderProps) => {

  const IconElement = <>{NBSP}<span><PlaceholderIcon size={24} /></span>{NBSP}</>;
  
  return (<span className={styles.PlaceholderIcon}>{placeholerText}{IconElement}</span>);
};

type UsePlaceholderProps = {
  icon?: Icon, 
  placeholerText?: string
}

const usePlaceholder = (props: UsePlaceholderProps) => {

  const PIcon: Icon = props.icon || Robot;
  const plText = props.placeholerText || 'Enter wordle for';

  const PlaceholderWithIcon = (
    <Placeholder PlaceholderIcon={PIcon} placeholerText={plText} />
  );

  return {
    PlaceholderWithIcon
  }
}

export { Placeholder as default, usePlaceholder };
