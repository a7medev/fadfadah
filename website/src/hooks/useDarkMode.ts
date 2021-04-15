import { useState, useLayoutEffect } from 'react';

const detectTheme = (): boolean => {
  const fromLocalStorage = localStorage.getItem('darkMode');

  if ((['true', 'false'] as Array<string | null>).includes(fromLocalStorage))
    return JSON.parse(fromLocalStorage!);

  const prefersDarkMode = matchMedia('(prefers-color-scheme: dark)');
  if (prefersDarkMode.matches) return true;

  return false;
};

const useDarkMode = (): [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>,
  () => boolean
] => {
  const [darkModeOn, setDarkModeOn] = useState<boolean>(detectTheme);

  useLayoutEffect(() => {
    if (darkModeOn) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }, [darkModeOn]);

  return [darkModeOn, setDarkModeOn, detectTheme];
};

export default useDarkMode;
