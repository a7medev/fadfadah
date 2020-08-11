import * as React from 'react';
import { BsHeartFill, BsHeart } from 'react-icons/bs';
import { motion, AnimatePresence, Variants, Transition } from 'framer-motion';

export interface LoveButtonProps {
  love: boolean;
  setLove: React.Dispatch<React.SetStateAction<boolean>>;
}

const variants: Variants = {
  in: { scale: 1 },
  out: { scale: 0 }
}
const transition: Transition = {
  type: 'spring'
}

const LoveButton: React.FC<LoveButtonProps> = ({ love, setLove }) => {
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
          onClick={() => setLove(false)}
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
          onClick={() => setLove(true)}
        >
          <BsHeart size="20px" />
        </motion.span>
      )}
    </AnimatePresence>
    </>
  );
};

export default LoveButton;
