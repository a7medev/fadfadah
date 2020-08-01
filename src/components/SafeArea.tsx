import React, { FC, ReactNode } from 'react';

interface Props {
  children: ReactNode
  paddingTop?: string | number
}

const SafeArea: FC<Props> = ({ children, paddingTop }) => {
  return (
    <div style={{ marginTop: 'calc(1rem + 40px)', paddingTop: paddingTop ?? 0 }}>
      {children}
    </div>
  )
}

export default SafeArea;
