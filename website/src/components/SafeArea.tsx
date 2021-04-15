import React from 'react';

interface SafeAreaProps {
  paddingTop?: string | number;
  noBottomNavbar?: boolean;
}

const SafeArea: React.FC<SafeAreaProps> = ({
  children,
  paddingTop,
  noBottomNavbar
}) => {
  return (
    <div
      className={`safe-area ${noBottomNavbar ? 'no-bottom-navbar' : ''}`}
      style={{ paddingTop: paddingTop ?? 0 }}
    >
      {children}
    </div>
  );
};

export default SafeArea;
