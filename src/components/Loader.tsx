import * as React from 'react';
import { motion } from 'framer-motion';

export interface LoaderProps {
  style?: React.CSSProperties | undefined
}

const Loader: React.FC<LoaderProps> = ({ style }) => {
  return (
    <motion.div
      style={style}
      className="loader"
      animate={{
        x: [-70, 70],
        y: [0, -90],
        transition: {
          x: {
            yoyo: Infinity,
            duration: 0.7
          },
          y: {
            yoyo: Infinity,
            duration: 0.35,
            ease: 'easeOut'
          }
        }
      }}
    ></motion.div>
  );
};

export default Loader;
