import { Button, Card } from 'react-bootstrap';
import { db, auth, functions } from '../config/firebase';
import IWhoRequest from '../types/WhoRequest';
import UserPhoto from './user/UserPhoto';
import { useAlertMessage } from '../contexts/AlertMessageContext';

export interface WhoRequestProps extends IWhoRequest {
  onDelete: (id: string) => void;
}

const acceptWhoRequest = functions.httpsCallable('acceptWhoRequest');

const WhoRequest: React.FC<WhoRequestProps> = ({
  id,
  message,
  from,
  onDelete
}) => {
  const { showAlertMessage } = useAlertMessage();

  const handleAccept = () => {
    acceptWhoRequest(id)
      .then(({ data: accepted }) => {
        if (accepted) {
          onDelete(id!);
          showAlertMessage('تم قبول الطلب بنجاح');
        } else {
          showAlertMessage('لم يتم قبول الطلب');
        }
      })
      .catch(err => {
        showAlertMessage(
          err.message !== 'internal'
            ? err.message
            : 'حدثت مشكلة أثناء محاولة قبول الطلب'
        );
      });
  };

  const handleDelete = () => {
    db.collection('users')
      .doc(auth.currentUser!.uid)
      .collection('who_requests')
      .doc(id)
      .delete()
      .then(() => {
        onDelete(id!);
        showAlertMessage('تم حذف الطلب بنجاح');
      })
      .catch(err => {
        showAlertMessage('حدثت مشكلة أثناء محاولة حذف الطلب');
      });
  };

  return (
    <Card className="mb-2">
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
          <Button variant="outline-dark" size="sm" onClick={handleDelete}>
            حذف
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default WhoRequest;
