import React from 'react';
import { motion } from 'framer-motion';

export interface LoaderProps {
  style?: React.CSSProperties,
  small?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ style, small }) => {
  return (
    <motion.div
      style={style}
      className={`loader ${small && 'small'}`}
      animate={{
        x: small ? [-40, 40] : [-70, 70],
        y: small ? [0, -60] : [0, -90],
        transition: {
          x: {
            yoyo: Infinity,
            duration: small ? 0.6 : 0.7
          },
          y: {
            yoyo: Infinity,
            duration: small ? 0.3 : 0.35,
            ease: 'easeOut'
          }
        }
      }}
    ></motion.div>
  );
};

export default Loader;
