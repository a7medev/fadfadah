import * as React from 'react';
import { useState, useRef } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { auth, storage } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
// import Gender from '../../types/Gender';

export interface AccountProps {
  setMessage: React.Dispatch<React.SetStateAction<string | null>>;
}

const Account: React.FC<AccountProps> = ({ setMessage }) => {
  const [photoFileText, setPhotoFileText] = useState('اضغط لتحديد ملف الصورة');
  const [photoFile, setPhotoFile] = useState<File | undefined>(undefined);

  const { setUser } = useAuth();

  const saveDataButton = useRef<HTMLButtonElement>(null);
  const displayName = useRef<HTMLInputElement>(null);

  // const [gender, setGender] = useState<string>(Gender.MALE);

  const user = auth.currentUser;

  const handlePhotoChange = async (event: any) => {
    const photoFile: File = event.target.files[0];
    setPhotoFileText(photoFile ? photoFile.name : 'اضغط لتحديد ملف الصورة');
    setPhotoFile(photoFile);
  }

  const changeAccountData = (event: React.FormEvent) => {
    event.preventDefault();

    saveDataButton.current!.disabled = true;

    if (!user) return;

    // Changing the name
    const nameIsChanged =
      (user.displayName ?? '') !== displayName.current!.value;

    if (nameIsChanged) {
      user
        .updateProfile({
          displayName: displayName.current!.value
        })
        .then(() => {
          setUser(prevUser => ({
            ...prevUser!,
            displayName: auth.currentUser!.displayName
          }));
          setMessage('تم تحديث الاسم بنجاح');
        })
        .catch(() => {
          setMessage('حدثت مشكلة أثناء محاولة تحديث الاسم');
        })
        .finally(() => {
          if (!photoFile) saveDataButton.current!.disabled = false;
        });
    } else if (!photoFile) {
      saveDataButton.current!.disabled = false;
    }

    // Changing the profile photo
    if (photoFile) {
      const isImage = /image\/.+/.test(photoFile.type);

      if (!isImage || !user) {
        setMessage('رجاءاً تأكد من تحديد ملف الصورة صالح');
        saveDataButton.current!.disabled = false;
        return;
      }

      const storageRef = storage.ref(
        `${user.uid}/profile_photo/${photoFile.name}`
      );
      const task = storageRef.put(photoFile);

      task
        .then(task => task.ref.getDownloadURL())
        .then(photoURL =>
          user.updateProfile({
            photoURL
          })
        )
        .then(() => {
          setUser(prevUser => ({
            ...prevUser!,
            photoURL: auth.currentUser!.photoURL
          }));
          setMessage('تم تحديث الصورة الشخصية بنجاح');
        })
        .catch(err => {
          console.error('Error uploading profile photo', err);
          setMessage('حدثت مشكلة أثناء محاولة تحديث الصورة الشخصية');
        })
        .finally(() => {
          saveDataButton.current!.disabled = false;
        });
    } else {
      saveDataButton.current!.disabled = false;
    }
  }

  return (
    <Card body className="mb-4" id="account-data">
      <h5 className="mb-3">بيانات الحساب</h5>

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
        {/* 
        <Form.Group>
          <Form.Label>النوع</Form.Label>
          <Form.Row>
            <Form.Check
              type="radio"
              custom
              name="gender"
              id="male"
              label="ذكر"
              value={Gender.MALE}
              checked={gender === Gender.MALE}
              onChange={(event: React.FormEvent) => {
                setGender((event.target as HTMLInputElement).value);
              }}
              className="ml-3"
            />
            <Form.Check
              type="radio"
              custom
              name="gender"
              id="female"
              label="أنثى"
              value={Gender.FEMALE}
              checked={gender === Gender.FEMALE}
              onChange={(event: React.FormEvent) => {
                setGender((event.target as HTMLInputElement).value);
              }}
            />
          </Form.Row>
        </Form.Group> */}

        <Button type="submit" ref={saveDataButton}>
          حفظ البيانات
        </Button>
      </Form>
    </Card>
  );
};

export default Account;