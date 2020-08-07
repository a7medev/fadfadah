import * as React from 'react';

interface SafeAreaProps {
  paddingTop?: string | number;
  fullHeight?: boolean;
}

const SafeArea: React.FC<SafeAreaProps> = ({ children, paddingTop, fullHeight }) => {
  return (
    <div style={{
      marginTop: 'calc(1rem + 40px)',
      paddingTop: paddingTop ?? 0,
      paddingBottom: '1rem',
      minHeight: fullHeight ? 'calc(100vh - 1rem - 40px)' : 'auto',
      overflowX: 'hidden'
    }}>
      {children}
    </div>
  )
}

export default SafeArea;
