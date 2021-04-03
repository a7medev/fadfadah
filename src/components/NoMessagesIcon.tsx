import * as React from 'react';
import { FaInbox } from 'react-icons/fa';

const NoMessages: React.FC = () => {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ opacity: 0.7 }}
    >
      <FaInbox size="4rem" className="mb-2" />

      <h5>لا يوجد رسائل</h5>
    </div>
  );
};

export default NoMessages;
