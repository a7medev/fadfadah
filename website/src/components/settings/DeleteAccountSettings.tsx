import { Alert, Button, Card } from 'react-bootstrap';
import { FaExclamationTriangle } from 'react-icons/fa';

import { auth } from '../../config/firebase';
import { useAlertMessage } from '../../contexts/AlertMessageContext';
import getErrorMessage from '../../utils/getErrorMessage';

const DeleteAccount: React.FC = () => {
  const { showAlertMessage } = useAlertMessage();

  const deleteAccount = () => {
    const isSure = window.confirm('هل أنت متأكد من رغبتك في حذف الحساب؟');

    if (isSure) {
      auth
        .currentUser!.delete()
        .then(() => {
          showAlertMessage('تم حذف الحساب بنجاح');
        })
        .catch(err => {
          showAlertMessage(getErrorMessage(err.code));
        });
    }
  };

  return (
    <Card body className="mb-4" id="account-data">
      <h5 className="mb-3">حذف الحساب</h5>
      <Alert variant="danger">
        <FaExclamationTriangle size="1rem" className="ml-2" />
        إذا قمت بحذف الحساب فلن تتمكن من استعادته مرة أخرى.
      </Alert>

      <Button variant="text-danger" onClick={deleteAccount}>
        أريد حذف حسابي
      </Button>
    </Card>
  );
};

export default DeleteAccount;
