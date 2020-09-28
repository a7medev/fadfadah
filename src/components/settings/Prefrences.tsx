import * as React from 'react';
import { useState } from 'react';
import { Card, Form } from 'react-bootstrap';
import { db } from '../../config/firebase';
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
  const initialDarkModeOn = !!localStorage.getItem('darkMode');
  const [darkModeOn, setDarkModeOn] = useState(initialDarkModeOn);

  function changeTheme(event: React.FormEvent) {
    const darkModeOn = (event.target as HTMLInputElement).checked;

    setDarkModeOn(darkModeOn);

    if (darkModeOn) {
      document.body.classList.add('dark');
      localStorage.setItem('darkMode', 'on');
    } else {
      document.body.classList.remove('dark');
      localStorage.removeItem('darkMode');
    }
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

      <Form.Group controlId="dark-mode">
        <Form.Switch
          label="الوضع المظلم"
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
