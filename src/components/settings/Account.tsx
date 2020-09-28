import * as React from 'react';
import { useState, useRef } from 'react';
import { Button, Card, Form } from 'react-bootstrap';

export interface AccountProps {
  user: firebase.User | null;
  setMessage: React.Dispatch<React.SetStateAction<string | null>>;
}

const Account: React.FC<AccountProps> = ({ user, setMessage }) => {
  const [photoFileText, setPhotoFileText] = useState<string>(
    'اضغط لتحديد ملف الصورة'
  );

  const saveDataButton = useRef<HTMLButtonElement>(null);
  const displayName = useRef<HTMLInputElement>(null);

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

  return (
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
  );
};

export default Account;
