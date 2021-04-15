import { useEffect } from 'react';

const useRedirectToFadfadah = () => {
  useEffect(() => {
    const link = 'https://fadfadah.me' + location.pathname + location.search;
    location.replace(link);
  }, []);
};

export default useRedirectToFadfadah;
