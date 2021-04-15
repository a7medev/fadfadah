import { useEffect } from 'react';

import styles from './index.module.css';

const NotFound = () => {
  useEffect(() => {
    const link = 'https://fadfadah.me' + location.pathname + location.search;
    location.replace(link);
  }, []);

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
