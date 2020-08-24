import * as React from 'react';
import { MdFavoriteBorder, MdFavorite } from 'react-icons/md';

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
        <MdFavorite fill="#ff1450" size="1.5em" />
      ) : (
        <MdFavoriteBorder fill="#777" size="1.5em" />
      )}
    </span>
  );
};

export default StaticLoveButton;
