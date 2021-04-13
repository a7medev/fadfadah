import * as React from 'react';
import { useState, useRef, FormEvent } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { auth, db, functions } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import Gender from '../types/Gender';
import getErrorMessage from '../utils/getErrorMessage';

export interface CompleteAccountDataProps {
  missingUsername?: boolean;
  missingDisplayName?: boolean;
  missingGender?: boolean;
}

const usernameIsAvailable = functions.httpsCallable('usernameIsAvailable');
const setUsername = functions.httpsCallable('setUsername');

const CompleteAccountData: React.FC<CompleteAccountDataProps> = ({
  missingUsername,
  missingDisplayName,
  missingGender
}) => {
  const fullName = useRef<HTMLInputElement>(null);
  const username = useRef<HTMLInputElement>(null);
  const [gender, setGender] = useState<string>();

  const { user, setUser } = useAuth();

  const [displayNameError, setDisplayNameError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [genderError, setGenderError] = useState<string | null>(null);

  const saveUsername = async () => {
    // Validate username
    if (!/^[A-Z_0-9]+$/i.test(username.current?.value.trim()!))
      return setUsernameError(
        'اسم المستخدم يجب أن يحتوي على أحرف إنجليزية وأرقام و _ فقط'
      );

    try {
      const { data: validUsername } = await usernameIsAvailable(
        username.current?.value
      );

      if (!validUsername) return setUsernameError('اسم المستخدم غير متاح');

      const usernameUpdated = await setUsername(username.current?.value);

      if (!usernameUpdated)
        return setUsernameError('حدثت مشكلة أثناء تعيين اسم المسخدم الخاص بك');

      setUser(prevUser => ({
        ...prevUser!,
        username: username.current!.value.trim()
      }));
    } catch (err) {
      console.error(err);
      setUsernameError(getErrorMessage(err.code));
    }
  }

  const saveDisplayName = () => {
    if (!/^\p{L}+( \p{L}+)*$/u.test(fullName.current!.value.trim()))
      return setDisplayNameError('رجاءاً أدخل اسماً صالحاً');

    return auth
      .currentUser!.updateProfile({
        displayName: fullName.current!.value.trim()
      })
      .then(() =>
        setUser(prevUser => ({
          ...prevUser!,
          displayName: fullName.current!.value.trim()
        }))
      )
      .catch(err => {
        console.error(err);
        setDisplayNameError(getErrorMessage(err.code));
      });
  }

  const saveGender = () => {
    return db
      .collection('users')
      .doc(user!.uid)
      .update({
        gender
      })
      .then(() =>
        setUser(prevUser => ({
          ...prevUser!,
          gender: gender as Gender
        }))
      )
      .catch(err => {
        console.error(err);
        setGenderError(getErrorMessage(err.code));
      });
  }

  const completeAccountData = (event: FormEvent) => {
    event.preventDefault();

    if (missingDisplayName) saveDisplayName();
    if (missingUsername) saveUsername();
    if (missingGender) saveGender();
  }

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
                ref={fullName}
                type="text"
                placeholder="اكتب اسمك هنا"
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
                ref={username}
                type="text"
                placeholder="يجب أن يحتوي على أحرف إنجليزية وأرقام و _ فقط"
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
