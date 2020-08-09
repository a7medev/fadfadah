import * as React from 'react';
import { useRef, useContext, FormEvent } from 'react';
import { AuthContext } from '../../store/AuthContext';
import { Form, Container, Card, Button } from 'react-bootstrap';
import { auth } from '../../config/firebase';

const SignedHome = () => {
  const { user, setUser } = useContext(AuthContext)!;
  const fullName = useRef<HTMLInputElement>(null);

  function changeDisplayName(event: FormEvent) {
    event.preventDefault();

    auth.currentUser
      ?.updateProfile({
        displayName: fullName.current?.value!
      })
      .then(() =>
        setUser(prevUser => ({
          ...prevUser!,
          displayName: fullName.current?.value!
        }))
      )
      .catch(err => {
        console.error(err);
        alert(err.message);
      });
  }

  return (
    <Container>
      {!user?.displayName ? (
        <Card style={{ maxWidth: '600px' }} className="mx-auto my-3">
          <Card.Body>
            <Card.Title>
              <h5>يبدو أن الحساب لا يحتوي على اسم</h5>
            </Card.Title>
            <Card.Subtitle className="text-muted mb-3">
              يحدث ذلك غالباً بسبب مشاكل في الشبكة أثناء إنشاء الحساب
            </Card.Subtitle>
            <Form onSubmit={changeDisplayName}>
              <Form.Group className="mb-2">
                <Form.Control
                  ref={fullName}
                  type="text"
                  placeholder="اكتب اسمك هنا"
                />
              </Form.Group>

              <Button type="submit">حفظ الاسم</Button>
            </Form>
          </Card.Body>
        </Card>
      ) : (
        <h1>مرحباً {user?.displayName}!</h1>
      )}
    </Container>
  );
};

export default SignedHome;
