import * as React from 'react';
import { BsHeartFill, BsHeart } from 'react-icons/bs';
import { motion, AnimatePresence, Variants, Transition } from 'framer-motion';

export interface LoveButtonProps {
  love: boolean;
}

const variants: Variants = {
  in: { scale: 1 },
  out: { scale: 0 }
}
const transition: Transition = {
  type: 'spring'
}

const LoveButton: React.FC<LoveButtonProps> = ({ love }) => {
  return (
    <>
    <AnimatePresence>
      {love && (
        <motion.span
          style={{ position: 'absolute', left: '20px' }}
          variants={variants}
          transition={transition}
          initial="out"
          animate="in"
          exit="out"
        >
          <BsHeartFill fill="#ff1450" size="20px" />
        </motion.span>
      )}
    </AnimatePresence>
    <AnimatePresence>
      {!love && (
        <motion.span
          style={{ position: 'absolute', left: '20px' }}
          variants={variants}
          transition={transition}
          initial="out"
          animate="in"
          exit="out"
        >
          <BsHeart size="20px" />
        </motion.span>
      )}
    </AnimatePresence>
    </>
  );
};

export default LoveButton;
