import React from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

export interface StaticLoveButtonProps {
  love: boolean;
}

const StaticLoveButton: React.FC<StaticLoveButtonProps> = ({ love }) => {
  return (
    <span
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'
      }}
    >
      {love ? (
        <FaHeart fill="#ff1450" size="1.2em" />
      ) : (
        <FaRegHeart fill="#777" size="1.2em" />
      )}
    </span>
  );
};

export default StaticLoveButton;
