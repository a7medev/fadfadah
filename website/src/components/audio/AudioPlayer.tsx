import { useCallback, useEffect, useRef, useState } from 'react';

import PlayButton from './PlayButton';
import ProgressBar from './ProgressBar';
import styles from './AudioPlayer.module.css';

export interface AudioPlayerProps {
  url?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ url }) => {
  const audioElement = useRef<HTMLAudioElement>(null);

  const [duration, setDuration] = useState(0);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleTimeChange = useCallback(() => {
    const audio = audioElement.current;

    if (!audio) {
      setDuration(0);
      setTime(0);
      return;
    }

    setDuration(audio.duration);
    setTime(audio.currentTime);
  }, []);

  const handleEnded = useCallback(() => setIsPlaying(false), []);

  useEffect(() => {
    const audio = audioElement.current;

    if (!audio) {
      return;
    }

    audio.addEventListener('loadeddata', handleTimeChange);
    audio.addEventListener('timeupdate', handleTimeChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadeddata', handleTimeChange);
      audio.removeEventListener('timeupdate', handleTimeChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [handleTimeChange, handleEnded]);

  useEffect(() => {
    const audio = audioElement.current;

    if (!audio) {
      return;
    }

    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  return (
    <>
      <audio ref={audioElement}>
        <source src={url} />
      </audio>

      <div className={styles.container}>
        <PlayButton
          playing={isPlaying}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        <ProgressBar duration={duration} time={time} />
      </div>
    </>
  );
};

export default AudioPlayer;
