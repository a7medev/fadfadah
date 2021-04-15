import Head from 'next/head';

import useRedirectToFadfadah from '../hooks/useRedirectToFadfadah';
import styles from './index.module.css';

const NotFound = () => {
  useRedirectToFadfadah();

  return (
    <div className={styles.container}>
      <Head>
        <meta property="og:image" content="/images/card-image.png" />
      </Head>

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
