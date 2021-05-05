import { Button } from 'react-bootstrap';
import { FaMicrophone } from 'react-icons/fa';

import styles from './RecordButton.module.scss';

export interface RecordButtonProps {
  recording?: boolean;
  onRecord: () => void;
  onStop: () => void;
}

const RecordButton: React.FC<RecordButtonProps> = ({
  recording,
  onRecord,
  onStop
}) => {
  return (
    <Button
      className={[
        'fab',
        styles.recordButton,
        recording ? styles.recording : ''
      ].join(' ')}
      onTouchStart={onRecord}
      onTouchEnd={onStop}
      onClick={recording ? onStop : onRecord}
    >
      <FaMicrophone size={20} />
    </Button>
  );
};

export default RecordButton;
