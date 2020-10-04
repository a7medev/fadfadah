import * as React from 'react';

interface SafeAreaProps {
  paddingTop?: string | number;
}

const SafeArea: React.FC<SafeAreaProps> = ({ children, paddingTop }) => {
  return (
    <div className="safe-area" style={{ paddingTop: paddingTop ?? 0 }}>
      {children}
    </div>
  );
};

export default SafeArea;
