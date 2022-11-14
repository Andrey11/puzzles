import React from 'react';

import styles from './GameSettingsSelector.module.scss';

import Form from 'react-bootstrap/Form';

type RoundsSelectorCallback = (event: any) => void;
type RoundSelectorProps = { onRoundsSelected: RoundsSelectorCallback };

const GameSettingsSelector: React.FC<RoundSelectorProps> = (props) => {
  const onRoundsSelected = (targetEl: HTMLInputElement) => {
    const rounds = parseInt(targetEl.value);
    props.onRoundsSelected(rounds);
  };

  return (
    <div className={styles.RoundSelectorComponent}>
      <Form
        onChange={(event) => onRoundsSelected(event.target as HTMLInputElement)}
      >
        <div key={`inline-radio`} className="mb-3">
          <Form.Check
            inline
            label="One Round"
            defaultChecked
            value={2}
            name="roundSelectionGroup"
            type="radio"
            id={`inline-radio-1`}
          />
          <Form.Check
            inline
            label="Three Rounds"
            value={6}
            name="roundSelectionGroup"
            type="radio"
            id={`inline-radio-2`}
          />
          <Form.Check
            inline
            label="Five Rounds"
            name="roundSelectionGroup"
            value={10}
            type="radio"
            id={`inline-radio-3`}
          />
        </div>
      </Form>
    </div>
  );
};

export default GameSettingsSelector;
