import { useEffect } from 'react';

import styles from './index.module.css';

const Index = () => {
  useEffect(() => {
    location.replace('https://fadfadah.me');
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

export default Index;
