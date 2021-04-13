import * as React from 'react';
import { useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { auth, db, storage } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

export interface AccountProps {
  setMessage: React.Dispatch<React.SetStateAction<string | null>>;
}

const Account: React.FC<AccountProps> = ({ setMessage }) => {
  const [photoFileText, setPhotoFileText] = useState('اضغط لتحديد ملف الصورة');
  const [photoFile, setPhotoFile] = useState<File>();
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { setUser } = useAuth();

  const user = auth.currentUser;

  const handlePhotoChange = async (event: any) => {
    const photoFile: File = event.target.files[0];
    setPhotoFileText(photoFile ? photoFile.name : 'اضغط لتحديد ملف الصورة');
    setPhotoFile(photoFile);
  };

  const changeAccountData = (event: React.FormEvent) => {
    event.preventDefault();

    setIsLoading(true);

    if (!user) {
      return setIsLoading(false);
    }

    const isNameChanged = (user.displayName ?? '') !== displayName;

    if (isNameChanged) {
      db.collection('users')
        .doc(user.uid)
        .update({ displayName })
        .then(() => {
          setUser(prevUser => {
            if (prevUser) {
              return { ...prevUser, displayName };
            }
            return null;
          });
          setMessage('تم تحديث الاسم بنجاح');
        })
        .catch(() => {
          setMessage('حدثت مشكلة أثناء محاولة تحديث الاسم');
        })
        .finally(() => {
          if (!photoFile) setIsLoading(false);
        });
    } else if (!photoFile) {
      setIsLoading(false);
    }

    if (photoFile) {
      const isImage = /image\/.+/.test(photoFile.type);

      if (!isImage || !user) {
        setMessage('رجاءاً تأكد من تحديد ملف الصورة صالح');
        setIsLoading(false);
        return;
      }

      const storageRef = storage.ref(
        `${user.uid}/profile_photo/${photoFile.name}`
      );
      const task = storageRef.put(photoFile);

      task
        .then(task => task.ref.getDownloadURL())
        .then(photoURL =>
          db.collection('users').doc(user.uid).update({ photoURL })
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
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  };

  return (
    <Card body className="mb-4" id="account-data">
      <h5 className="mb-3">بيانات الحساب</h5>

      <Form onSubmit={changeAccountData}>
        <Form.Group controlId="display-name">
          <Form.Label>الاسم كامل</Form.Label>
          <Form.Control
            placeholder="اكتب اسمك هنا"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
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

        <Button type="submit" disabled={isLoading}>
          حفظ البيانات
        </Button>
      </Form>
    </Card>
  );
};

export default Account;
