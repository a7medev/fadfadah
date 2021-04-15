import useRedirectToFadfadah from '../hooks/useRedirectToFadfadah';
import styles from './index.module.css';

const NotFound = () => {
  useRedirectToFadfadah();

  return (
    <div className={styles.container}>
      <img
        src="/images/logo.png"
        width={200}
        height={200}
        className={styles.logo}
      />
    </div>
  );
};

export default NotFound;
