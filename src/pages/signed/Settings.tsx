import * as React from 'react';
import { useState, useContext, useRef } from 'react';
import PageTransition from '../../components/PageTransition';
import { Container, Form, Card, Button } from 'react-bootstrap';
import { AuthContext } from '../../store/AuthContext';
import MessageBox from '../../components/MessageBox';
import { db, auth, messages } from '../../config/firebase';
import { auth as appAuth } from 'firebase/app';
import 'firebase/auth';
import { Helmet } from 'react-helmet';

const Settings: React.FC = () => {
  const initialDarkModeOn = !!localStorage.getItem('darkMode');
  const [darkModeOn, setDarkModeOn] = useState(initialDarkModeOn);

  const { user, userData, setUserData } = useContext(AuthContext)!;

  const [photoFileText, setPhotoFileText] = useState<string>(
    'اضغط لتحديد ملف الصورة'
  );

  const [message, setMessage] = useState<string | null>(null);

  const displayName = useRef<HTMLInputElement>(null);
  const saveDataButton = useRef<HTMLButtonElement>(null);

  function changeTheme(event: any) {
    const darkModeOn = event.target.checked;

    setDarkModeOn(darkModeOn);

    if (darkModeOn) {
      document.body.classList.add('dark');
      localStorage.setItem('darkMode', 'on');
    } else {
      document.body.classList.remove('dark');
      localStorage.removeItem('darkMode');
    }
  }

  function changeBlockUnsignedMessages(event: any) {
    const blockUnsignedMessages = event.target.checked;

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

  function changeAirplaneMode(event: any) {
    const airplaneMode = event.target.checked;

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

  function handlePhotoChange(event: any) {
    const photoFile = event.target.files[0];
    setPhotoFileText(photoFile ? photoFile.name : 'اضغط لتحديد ملف الصورة');
  }

  function changeAccountData(event: React.FormEvent) {
    event.preventDefault();

    saveDataButton.current!.disabled = true;

    const nameIsChanged =
      (user?.displayName ?? '') !== displayName.current?.value;

    if (nameIsChanged) {
      user
        ?.updateProfile({
          displayName: displayName.current?.value
        })
        .then(() => {
          setMessage('تم تحديث البيانات بنجاح');
        })
        .catch(() => {
          setMessage('حدثت مشكلة أثناء محاولة تحديث البيانات');
        })
        .finally(() => {
          saveDataButton.current!.disabled = false;
        });
    } else {
      saveDataButton.current!.disabled = false;
    }
  }

  const changePasswordButton = useRef<HTMLButtonElement>(null);
  const newPassword = useRef<HTMLInputElement>(null);
  const currentPassword = useRef<HTMLInputElement>(null);

  function changePassword(event: React.FormEvent) {
    event.preventDefault();
    changePasswordButton.current!.disabled = true;

    const user = auth.currentUser!;
    const emailProvider = user?.providerData.find(
      provider => provider?.providerId === appAuth.EmailAuthProvider.PROVIDER_ID
    );

    if (!emailProvider)
      return setMessage(
        'يمكن للأشخاص الذين يملكون حساباً مربوطاً بالبريد الإلكتروني فقط تغيير كلمة المرور'
      );

    const cred = appAuth.EmailAuthProvider.credential(
      emailProvider.email!,
      currentPassword.current?.value!
    );
    user
      .reauthenticateWithCredential(cred)
      .then(() => user.updatePassword(newPassword.current?.value!))
      .then(() => {
        setMessage('تم تغيير كلمة المرور بنجاح');
      })
      .catch(err => {
        // @ts-ignore
        setMessage(messages[err.code] ?? 'حدثت مشكلة ما');
      })
      .finally(() => {
        changePasswordButton.current!.disabled = false;
      })
  }

  return (
    <PageTransition>
      <Helmet>
        <title>الإعدادات | فضفضة</title>
      </Helmet>
      <Container className="pt-2">
        <h3 className="mb-3">الإعدادات</h3>
        <hr />

        <MessageBox
          show={!!message}
          onClose={() => setMessage(null)}
          title="رسالة من الموقع"
          text={message!}
        />

        <Card body className="mb-4">
          <h4>التفضيلات</h4>

          <Form.Group controlId="block-unsigned-messages">
            <Form.Switch
              label="منع استلام الرسائل من غير المُسَجَّلين"
              checked={!!userData?.settings?.blockUnsignedMessages}
              onChange={changeBlockUnsignedMessages}
            />
            <Form.Text className="text-muted">
              سيمنع هذا الأشخاص غير المسجلين على فضفضة مراسلتك، مما يفيدك إن
              أردت حظر مستخدمٍ ما
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

        <Card body className="mb-4">
          <h4>بيانات الحساب</h4>

          <Form onSubmit={changeAccountData}>
            <Form.Group controlId="display-name">
              <Form.Label>الاسم كامل</Form.Label>
              <Form.Control
                placeholder="اكتب اسمك هنا"
                defaultValue={user?.displayName ?? ''}
                ref={displayName}
              />
            </Form.Group>

            <Form.Group controlId="profile-photo">
              <Form.Label>الصورة الشخصية</Form.Label>
              <Form.File
                custom
                data-browse="تحديد الصورة"
                label={photoFileText}
                accept=".png, .jpg, .jpeg"
                onChange={handlePhotoChange}
              />
            </Form.Group>

            <Button type="submit" ref={saveDataButton}>
              حفظ البيانات
            </Button>
          </Form>
        </Card>

        <Card body className="mb-4">
          <h4>تغيير كلمة المرور</h4>

          <Form onSubmit={changePassword}>
            <Form.Group controlId="current-password">
              <Form.Label>كلمة المرور الحالية</Form.Label>
              <Form.Control
                type="password"
                placeholder="أدخل كلمة المرور الحالية هنا"
                ref={currentPassword}
              />
            </Form.Group>

            <Form.Group controlId="new-password">
              <Form.Label>كلمة المرور الجديدة</Form.Label>
              <Form.Control
                type="password"
                placeholder="أدخل كلمة المرور الجديدة هنا"
                ref={newPassword}
              />
            </Form.Group>

            <Button type="submit" ref={changePasswordButton}>تغيرر كلمة المرور</Button>
          </Form>
        </Card>
      </Container>
    </PageTransition>
  );
};

export default Settings;
