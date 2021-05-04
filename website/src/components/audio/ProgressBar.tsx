import formatDuration from '../../utils/formatDuration';
import styles from './ProgressBar.module.scss';

export interface ProgressBarProps {
  time: number;
  duration: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ time, duration }) => {
  const formattedTime = formatDuration(time);
  const formattedDuration = formatDuration(duration);

  const width = (time / duration) * 100;

  return (
    <div className={styles.container}>
      <div
        role="progressbar"
        aria-valuenow={width}
        className={styles.barContainer}
      >
        <div className={styles.bar} style={{ width: width + '%' }} />
      </div>
      <span>
        {formattedTime} / {formattedDuration}
      </span>
    </div>
  );
};

export default ProgressBar;
