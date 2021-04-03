import * as React from 'react';
import { Link as ReachLink, LinkProps as ReachLinkProps } from '@reach/router';

export interface LinkProps
  extends React.PropsWithoutRef<ReachLinkProps<any>>,
    React.RefAttributes<HTMLAnchorElement> {}

const Link: React.FC<LinkProps> = props => {
  return (
    <ReachLink
      {...props}
      getProps={({ isCurrent }) => ({
        className: isCurrent
          ? `${props.className ?? ''} active`
          : props.className
      })}
    />
  );
};

export default Link;
