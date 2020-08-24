import * as React from 'react';
import { useState } from 'react';
import PageTransition from '../../components/PageTransition';
import { Container, Form } from 'react-bootstrap';

const Settings = () => {
  const initialDarkModeOn = !!localStorage.getItem('darkMode');
  const [darkModeOn, setDarkModeOn] = useState(initialDarkModeOn);

  function changeTheme(e: any) {
    const darkModeOn = e.target.checked;

    setDarkModeOn(darkModeOn);

    if (darkModeOn) {
      document.body.classList.add('dark');
      localStorage.setItem('darkMode', 'on');
    } else {
      document.body.classList.remove('dark');
      localStorage.removeItem('darkMode');
    }
  }

  return (
    <PageTransition>
      <Container className="pt-2">
        <h4>الإعدادات</h4>
        <Form.Switch label="استلام الرسائل من العامة" id="public-messages" />
        <Form.Switch
          label="الوضع المظلم"
          id="dark-mode"
          checked={darkModeOn}
          onChange={changeTheme}
        />
      </Container>
    </PageTransition>
  );
};

export default Settings;
