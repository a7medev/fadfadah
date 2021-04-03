import * as React from 'react';
import { useState } from 'react';
import { Card, Form } from 'react-bootstrap';
import { db } from '../config/firebase';
import useDarkMode from '../hooks/useDarkMode';
import MiniUser from '../types/MiniUser';
import Settings from '../types/Settings';

export interface PrefrencesProps {
  user: MiniUser;
  settings: Settings | null;
  setSettings: React.Dispatch<
    React.SetStateAction<Settings | null | undefined>
  >;
}

const Prefrences: React.FC<PrefrencesProps> = ({
  user,
  settings,
  setSettings
}) => {
  const [darkModeOn, setDarkModeOn, detectTheme] = useDarkMode();

  const initialAutoDetectTheme = !localStorage.getItem('darkMode');
  const [autoDetectThemeOn, setAutoDetectThemeOn] = useState(
    initialAutoDetectTheme
  );

  const changeTheme = (event: React.FormEvent) => {
    if (autoDetectThemeOn) return;

    const darkModeOn = (event.target as HTMLInputElement).checked;

    setDarkModeOn(darkModeOn);

    localStorage.setItem('darkMode', `${darkModeOn}`);
  }

  const changeAutoDetectTheme = (event: React.FormEvent) => {
    const autoDetectThemeOn = (event.target as HTMLInputElement).checked;

    if (autoDetectThemeOn) localStorage.removeItem('darkMode');
    else localStorage.setItem('darkMode', `${darkModeOn}`);

    setAutoDetectThemeOn(autoDetectThemeOn);
    setDarkModeOn(detectTheme);
  }

  const changeBlockUnsignedMessages = (event: React.FormEvent) => {
    const blockUnsignedMessages = (event.target as HTMLInputElement).checked;

    db.collection('users').doc(user!.uid).set(
      {
        settings: { blockUnsignedMessages }
      },
      { merge: true }
    );

    setSettings(prevSettings =>
      prevSettings
        ? {
            ...prevSettings,
            blockUnsignedMessages
          }
        : null
    );
  }

  const changeAirplaneMode = (event: React.FormEvent) => {
    const airplaneMode = (event.target as HTMLInputElement).checked;

    db.collection('users').doc(user!.uid).set(
      {
        settings: { airplaneMode }
      },
      { merge: true }
    );

    setSettings(prevSettings =>
      prevSettings
        ? {
            ...prevSettings,
            airplaneMode
          }
        : undefined
    );
  }

  return (
    <Card body className="mb-4" id="prefrences">
      <h5 className="mb-3">التفضيلات</h5>

      <Form.Group controlId="block-unsigned-messages">
        <Form.Switch
          label="منع استلام الرسائل من غير المُسَجَّلين"
          checked={!!settings?.blockUnsignedMessages}
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
          label="منع استلام الرسائل من الجميع"
          checked={!!settings?.airplaneMode}
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
