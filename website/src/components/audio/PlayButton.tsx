import { Button } from 'react-bootstrap';
import { FaPlay, FaPause } from 'react-icons/fa';

export interface PlayButtonProps {
  playing?: boolean;
  onPlay: () => void;
  onPause: () => void;
}

const PlayButton: React.FC<PlayButtonProps> = ({
  playing,
  onPlay,
  onPause
}) => {
  if (playing) {
    return (
      <Button variant="outline-primary" className="fab" onClick={onPause}>
        <FaPause />
      </Button>
    );
  }

  return (
    <Button variant="outline-primary" className="fab" onClick={onPlay}>
      <FaPlay />
    </Button>
  );
};

export default PlayButton;
