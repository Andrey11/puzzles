import React, { useRef } from 'react';

import { VolumeUp } from 'react-bootstrap-icons';

import styles from './WordleDictionary.module.scss';

type IPhoneticAudioWordProps = {
  audio: string;
  text: string;
};

const PhoneticAudioWord: React.FunctionComponent<IPhoneticAudioWordProps> = ({
  text,
  audio,
}: IPhoneticAudioWordProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const playAudio = () => {
    if (audioRef && audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <div className={styles.Phonetics}>
      {audio && <VolumeUp size={24} onClick={playAudio} />}
      <audio ref={audioRef} src={audio}>
        Your browser does not support the
        <code>audio</code> element.
      </audio>
      {' '}{text}
    </div>
  );
};

export default PhoneticAudioWord;
