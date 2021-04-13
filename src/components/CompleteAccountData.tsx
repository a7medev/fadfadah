import * as React from 'react';
import { useState, FormEvent } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { db, functions } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import Gender from '../types/Gender';
import getErrorMessage from '../utils/getErrorMessage';

export interface CompleteAccountDataProps {
  missingUsername?: boolean;
  missingDisplayName?: boolean;
  missingGender?: boolean;
}

const usernameIsAvailable = functions.httpsCallable('usernameIsAvailable');
const changeUsername = functions.httpsCallable('setUsername');

const CompleteAccountData: React.FC<CompleteAccountDataProps> = ({
  missingUsername,
  missingDisplayName,
  missingGender
}) => {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [gender, setGender] = useState<string>();

  const { user, setUser } = useAuth();

  const [displayNameError, setDisplayNameError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [genderError, setGenderError] = useState<string | null>(null);

  const saveUsername = async () => {
    // Validate username
    if (!/^[A-Z_0-9]+$/i.test(username.trim())) {
      return setUsernameError(
        'اسم المستخدم يجب أن يحتوي على أحرف إنجليزية وأرقام و _ فقط'
      );
    }

    try {
      const { data: validUsername } = await usernameIsAvailable(username);

      if (!validUsername) {
        return setUsernameError('اسم المستخدم غير متاح');
      }

      const usernameUpdated = await changeUsername(username);

      if (!usernameUpdated) {
        return setUsernameError('حدثت مشكلة أثناء تعيين اسم المسخدم الخاص بك');
      }

      setUser(prevUser => ({
        ...prevUser!,
        username: username.trim()
      }));
    } catch (err) {
      console.error(err);
      setUsernameError(getErrorMessage(err.code));
    }
  };

  const saveDisplayName = () => {
    if (!user) return;

    if (!/^\p{L}+( \p{L}+)*$/u.test(displayName.trim())) {
      return setDisplayNameError('رجاءاً أدخل اسماً صالحاً');
    }

    return db
      .collection('users')
      .doc(user.uid)
      .update({ displayName })
      .then(() => {
        setUser(prevUser => {
          if (prevUser) {
            return { ...prevUser, displayName: displayName.trim() };
          }
          return null;
        });
      })
      .catch(err => {
        console.error(err);
        setDisplayNameError(getErrorMessage(err.code));
      });
  };

  const saveGender = () => {
    if (!user) return;

    db.collection('users')
      .doc(user.uid)
      .update({
        gender
      })
      .then(() => {
        setUser(prevUser => {
          if (prevUser) {
            return { ...prevUser, gender: gender as Gender };
          }
          return null;
        });
      })
      .catch(err => {
        console.error(err);
        setGenderError(getErrorMessage(err.code));
      });
  };

  const completeAccountData = (event: FormEvent) => {
    event.preventDefault();

    if (missingDisplayName) saveDisplayName();
    if (missingUsername) saveUsername();
    if (missingGender) saveGender();
  };

  return (
    <Card className="mb-2">
      <Card.Body>
        <Card.Title>
          <h5>قم بإكمال بيانات حسابك</h5>
        </Card.Title>

        <Form onSubmit={completeAccountData}>
          {missingDisplayName && (
            <Form.Group controlId="display-name">
              <Form.Label>الاسم كامل</Form.Label>
              <Form.Control
                type="text"
                placeholder="اكتب اسمك هنا"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                isInvalid={!!displayNameError}
              />
              {displayNameError && (
                <Form.Control.Feedback type="invalid">
                  {displayNameError}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          )}

          {missingUsername && (
            <Form.Group controlId="display-name">
              <Form.Label>اسم المستخدم</Form.Label>
              <Form.Control
                type="text"
                placeholder="يجب أن يحتوي على أحرف إنجليزية وأرقام و _ فقط"
                value={username}
                onChange={e => setUsername(e.target.value)}
                isInvalid={!!usernameError}
              />
              {usernameError && (
                <Form.Control.Feedback type="invalid">
                  {usernameError}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          )}

          {missingGender && (
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
                  onChange={(e: React.FormEvent) => {
                    setGender((e.target as HTMLInputElement).value);
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
                  onChange={(e: React.FormEvent) => {
                    setGender((e.target as HTMLInputElement).value);
                  }}
                />
              </Form.Row>
              {genderError && (
                <Form.Control.Feedback type="invalid">
                  {genderError}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          )}

          <Button type="submit">حفظ البيانات</Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CompleteAccountData;
