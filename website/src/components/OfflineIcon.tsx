import React from 'react';
import { MdPortableWifiOff } from 'react-icons/md';

const Offline: React.FC = () => {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ opacity: 0.7 }}
    >
      <MdPortableWifiOff size="4rem" className="mb-2" />

      <h5>لا يتوفر إتصال بالإنترنت</h5>
    </div>
  );
};

export default Offline;
