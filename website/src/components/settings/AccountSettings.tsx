import { ChangeEvent, useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';

import { auth, db, storage } from '../../config/firebase';
import { useAlertMessage } from '../../contexts/AlertMessageContext';
import { useAuth } from '../../contexts/AuthContext';
import styles from './AccountSettings.module.scss';

const Account: React.FC = () => {
  const { user, setUser } = useAuth();

  const { showAlertMessage } = useAlertMessage();

  const [photoFile, setPhotoFile] = useState<File>();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [photoPreview, setPhotoPreview] = useState(user?.photoURL);
  const [isLoading, setIsLoading] = useState(false);

  const handlePhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const photoFile = event.target.files?.[0];
    setPhotoFile(photoFile);

    if (!photoFile) return setPhotoPreview(null);
    const reader = new FileReader();
    reader.onload = e => setPhotoPreview(e.target?.result as string | null);
    reader.readAsDataURL(photoFile);
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
          showAlertMessage('تم تحديث الاسم بنجاح');
        })
        .catch(() => {
          showAlertMessage('حدثت مشكلة أثناء محاولة تحديث الاسم');
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
        showAlertMessage('رجاءاً تأكد من تحديد ملف الصورة صالح');
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
          showAlertMessage('تم تحديث الصورة الشخصية بنجاح');
        })
        .catch(err => {
          console.error('Error uploading profile photo', err);
          showAlertMessage('حدثت مشكلة أثناء محاولة تحديث الصورة الشخصية');
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  };

  return (
    <Card
      body
      id="account-data"
      className={['mb-4', styles.accountDataCard].join(' ')}
    >
      <Form onSubmit={changeAccountData}>
        <Form.Group className={styles.photoInputGroup}>
          <label htmlFor="photo">
            <div className={[styles.photoPicker, 'shadow-sm'].join(' ')}>
              {photoPreview && (
                <img
                  src={photoPreview}
                  alt={user?.displayName || 'مستخدم فضفضة'}
                />
              )}
            </div>
          </label>
          <input
            id="photo"
            type="file"
            accept=".png, .jpg, .jpeg"
            onChange={handlePhotoChange}
            className={styles.photoInput}
          />
        </Form.Group>

        <Form.Group controlId="display-name">
          <Form.Label>الاسم كامل</Form.Label>
          <Form.Control
            placeholder="اكتب اسمك هنا"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
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
