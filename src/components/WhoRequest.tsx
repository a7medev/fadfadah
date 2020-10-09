import * as React from 'react';
import { useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { db, auth, functions } from '../config/firebase';
import IWhoRequest from '../types/WhoRequest';
import UserPhoto from './UserPhoto';
import MessageBox from './MessageBox';

export interface WhoRequestProps extends IWhoRequest {
  removeReq: (id: string) => void;
}

const acceptWhoRequest = functions.httpsCallable('acceptWhoRequest');

const WhoRequest: React.FC<WhoRequestProps> = ({
  id,
  message,
  from,
  removeReq
}) => {
  const [messageText, setMessageText] = useState<string | null>(null);

  function handleAccept() {
    acceptWhoRequest(id)
      .then(({ data: accepted }) => {
        if (accepted) {
          removeReq(id!);
          setMessageText('تم قبول الطلب بنجاح');
        } else setMessageText('لم يتم قبول الطلب');
      })
      .catch(err => {
        console.error(err);
        setMessageText(
          err.message !== 'internal'
            ? err.message
            : 'حدثت مشكلة أثناء محاولة قبول الطلب'
        );
      });
  }

  function handleDelete() {
    db.collection('users')
      .doc(auth.currentUser!.uid)
      .collection('who_requests')
      .doc(id)
      .delete()
      .then(() => {
        removeReq(id!);
        setMessageText('تم حذف الطلب بنجاح');
      })
      .catch(err => {
        console.error(err);
        setMessageText('حدثت مشكلة أثناء محاولة حذف الطلب');
      });
  }

  return (
    <>
      <MessageBox
        show={!!messageText}
        onClose={() => setMessageText(null)}
        title="رسالة من الموقع"
        text={messageText!}
      />

      <Card>
        <Card.Body className="d-flex flex-wrap py-3">
          <div className="d-flex flex-grow-1">
            <UserPhoto
              url={from.photoURL}
              displayName={from.displayName}
              size={40}
            />

            <div className="flex-grow-1 mr-2">
              <p className="text-muted mb-n1" style={{ fontSize: '0.85rem' }}>
                أَرْسَلَهُ {from.displayName ?? 'مستخدم فضفضة'} على الرسالة
              </p>
              <p className="mb-0">{message.content}</p>
            </div>
          </div>

          <div className="mt-1 align-self-end mr-auto">
            <Button className="ml-1" size="sm" onClick={handleAccept}>
              قبول
            </Button>
            <Button variant="text-dark" size="sm" onClick={handleDelete}>
              حذف
            </Button>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default WhoRequest;
