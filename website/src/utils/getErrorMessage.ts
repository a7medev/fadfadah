import { messages } from '../config/firebase';

const getErrorMessage = (errorCode: string) => {
  if (errorCode in messages) {
    return messages[errorCode];
  }
  return 'حدثت مشكلة ما';
};

export default getErrorMessage;
