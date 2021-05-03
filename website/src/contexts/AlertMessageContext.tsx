import { createContext, useContext, useMemo, useState } from 'react';

import MessageBox from '../components/MessageBox';

export interface AlertMessageContextType {
  showAlertMessage: (message: string) => void;
  hideAlertMessage: () => void;
}

const AlertMessageContext = createContext<AlertMessageContextType | undefined>(
  undefined
);

export const useAlertMessage = () => {
  const value = useContext(AlertMessageContext);
  if (value === undefined) {
    throw new Error(
      'You must wrap the app with AlertMessageProvider to use useAlertMessage'
    );
  }
  return value;
};

const AlertMessageProvider: React.FC = ({ children }) => {
  const [message, setMessage] = useState('');

  const showAlertMessage = (message: string) => setMessage(message);
  const hideAlertMessage = () => setMessage('');

  const isAlertShown = useMemo(() => !!message, [message]);

  const value = useMemo(
    () => ({
      showAlertMessage,
      hideAlertMessage
    }),
    []
  );

  return (
    <AlertMessageContext.Provider value={value}>
      <MessageBox
        title="رسالة من الموقع"
        text={message}
        show={isAlertShown}
        onClose={hideAlertMessage}
      />
      {children}
    </AlertMessageContext.Provider>
  );
};

export default AlertMessageProvider;
