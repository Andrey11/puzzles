import React, { MutableRefObject, useState } from 'react';
import Select, { SelectInstance } from 'react-select';

import styles from './WordSelector.module.scss';

type SelectableOption = {
  value: string;
  label: string;
};

type WordSelectorProps = {
  words: Array<SelectableOption>;
  onWordSelected: (word: string) => void;
  placeholder?: React.ReactNode;
  refContainer?: MutableRefObject<HTMLDivElement> | MutableRefObject<null>;
  refSelector?: React.MutableRefObject<SelectInstance | null | undefined>;
  autoFocus?: boolean;
};

const WordSelector: React.FunctionComponent<WordSelectorProps> = ({
  words,
  onWordSelected,
  placeholder,
  refContainer,
  refSelector,
  autoFocus = true,
}: WordSelectorProps) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const filterOptions = (word: { label: string; value: string; data: any }, input: string) => {
    if (input === '') {
      return word.value.charAt(0) === 'A';
    }
    return word.value.indexOf(input.toUpperCase()) === 0;
  };

  return (
    <div ref={refContainer} className={styles.WordleSelector}>
      <Select
        autoFocus={autoFocus}
        blurInputOnSelect={true}
        ref={(ref) => {
          if (refSelector) {
            refSelector.current = ref;
          }
        }}
        components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
        menuIsOpen={menuOpen}
        filterOption={filterOptions}
        isClearable={true}
        onInputChange={(newVal: string) => {
          setMenuOpen(newVal.length > 1);
          return newVal.toLocaleUpperCase();
        }}
        onChange={(newValue: SelectableOption) => onWordSelected(newValue?.value || '')}
        options={words}
        placeholder={placeholder}
      />
    </div>
  );
};

export default WordSelector;
