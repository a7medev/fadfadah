import { useState, useLayoutEffect } from 'react';

function useDarkMode(): [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>,
  () => boolean
] {
  const [darkModeOn, setDarkModeOn] = useState<boolean>(detectTheme);

  function detectTheme(): boolean {
    const fromLocalStorage = localStorage.getItem('darkMode');

    if ((['true', 'false'] as Array<string | null>).includes(fromLocalStorage))
      return JSON.parse(fromLocalStorage!);

    const prefersDarkMode = matchMedia('(prefers-color-scheme: dark)');
    if (prefersDarkMode.matches) return true;

    return false;
  }

  useLayoutEffect(() => {
    if (darkModeOn) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }, [darkModeOn]);

  return [darkModeOn, setDarkModeOn, detectTheme];
}

export default useDarkMode;
