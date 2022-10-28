import React, { useEffect, useState } from 'react';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { IMatchType, IRadioGroupProps } from '../../PuzzleWordle.types';

import styles from './MatchTypeRadioGroup.module.scss';

const MatchTypeRadioGroup: React.FunctionComponent<IRadioGroupProps> = ({
  onChange,
  matchTypes,
  selectedType,
}: IRadioGroupProps) => {
  const [selectedMatchType, setSelectedMatchType] = useState<string>();

  useEffect(() => {
    if (selectedType) {
      setSelectedMatchType(selectedType);
    }
  }, [selectedType]);

  return (
    <div className={styles.MatchTypeRadioGroup}>
      <ButtonGroup>
        {matchTypes.map((matchType: IMatchType) => (
          <ToggleButton
            key={`tbg-key-${matchType.type}`}
            id={`tbg-btn-${matchType.type}`}
            type="radio"
            name="radio"
            value={matchType.type}
            variant={matchType.variant}
            checked={matchType.type === selectedMatchType}
            onChange={(e: any) => onChange(e.currentTarget.value)}
          >
            {matchType.label}
          </ToggleButton>
        ))}
      </ButtonGroup>
    </div>
  );
};

export default MatchTypeRadioGroup;
