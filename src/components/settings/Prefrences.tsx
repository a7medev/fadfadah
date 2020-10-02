import * as React from 'react';
import { useState } from 'react';
import { Card, Form } from 'react-bootstrap';
import { db } from '../../config/firebase';
import useDarkMode from '../../hooks/useDarkMode';
import UserData from '../../types/UserData';

export interface PrefrencesProps {
  user: firebase.User | null;
  userData: UserData | undefined;
  setUserData: React.Dispatch<React.SetStateAction<UserData | undefined>>;
}

const Prefrences: React.FC<PrefrencesProps> = ({
  user,
  userData,
  setUserData
}) => {
  const [darkModeOn, setDarkModeOn, detectTheme] = useDarkMode();

  const initialAutoDetectTheme = !localStorage.getItem('darkMode');
  const [autoDetectThemeOn, setAutoDetectThemeOn] = useState(
    initialAutoDetectTheme
  );

  function changeTheme(event: React.FormEvent) {
    if (autoDetectThemeOn) return;

    const darkModeOn = (event.target as HTMLInputElement).checked;

    setDarkModeOn(darkModeOn);

    localStorage.setItem('darkMode', `${darkModeOn}`);
  }

  function changeAutoDetectTheme(event: React.FormEvent) {
    const autoDetectThemeOn = (event.target as HTMLInputElement).checked;

    if (autoDetectThemeOn) localStorage.removeItem('darkMode');
    else localStorage.setItem('darkMode', `${darkModeOn}`);

    setAutoDetectThemeOn(autoDetectThemeOn);
    setDarkModeOn(detectTheme);
  }

  function changeBlockUnsignedMessages(event: React.FormEvent) {
    const blockUnsignedMessages = (event.target as HTMLInputElement).checked;

    db.collection('users').doc(user?.uid).set(
      {
        settings: { blockUnsignedMessages }
      },
      { merge: true }
    );

    setUserData(prevUserData => ({
      ...prevUserData,
      settings: prevUserData?.settings
        ? {
            ...prevUserData?.settings,
            blockUnsignedMessages
          }
        : undefined
    }));
  }

  function changeAirplaneMode(event: React.FormEvent) {
    const airplaneMode = (event.target as HTMLInputElement).checked;

    db.collection('users').doc(user?.uid).set(
      {
        settings: { airplaneMode }
      },
      { merge: true }
    );

    setUserData(prevUserData => ({
      ...prevUserData,
      settings: prevUserData?.settings
        ? {
            ...prevUserData?.settings,
            airplaneMode
          }
        : undefined
    }));
  }

  return (
    <Card body className="mb-4">
      <h4>التفضيلات</h4>

      <Form.Group controlId="block-unsigned-messages">
        <Form.Switch
          label="منع استلام الرسائل من غير المُسَجَّلين"
          checked={!!userData?.settings?.blockUnsignedMessages}
          onChange={changeBlockUnsignedMessages}
        />
        <Form.Text className="text-muted">
          سيمنع هذا الأشخاص غير المسجلين على فضفضة مراسلتك، مما يفيدك إن أردت
          حظر مستخدمٍ ما
        </Form.Text>
      </Form.Group>

      <Form.Group controlId="auto-detect-theme">
        <Form.Switch
          label="تحديد المظهر تلقائياً"
          checked={autoDetectThemeOn}
          onChange={changeAutoDetectTheme}
        />
        <Form.Text className="text-muted">
          سيقوم فضفضة بتحديد مظهره حسب إعدادات الجهاز
        </Form.Text>
      </Form.Group>

      <Form.Group controlId="dark-mode">
        <Form.Switch
          label="المظهر المظلم"
          disabled={autoDetectThemeOn}
          checked={darkModeOn}
          onChange={changeTheme}
        />
        <Form.Text className="text-muted">
          سيفعل هذا عرض فضفضة بألوان داكنةٍ مريحةٍ للعين
        </Form.Text>
      </Form.Group>

      <Form.Group controlId="airplane-mode" className="mb-0">
        <Form.Switch
          label="وضع الطيران"
          checked={!!userData?.settings?.airplaneMode}
          onChange={changeAirplaneMode}
        />
        <Form.Text className="text-muted">
          سيمنع هذا الأشخاص من إرسال الرسائل إليك
        </Form.Text>
      </Form.Group>
    </Card>
  );
};

export default Prefrences;
