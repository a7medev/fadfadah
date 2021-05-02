import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { motion, AnimatePresence, Variants, Transition } from 'framer-motion';

export interface LoveButtonProps {
  love: boolean;
  onLove: (love: boolean) => void;
}

const variants: Variants = {
  in: { scale: 1, x: '-50%', y: '-50%', transition: { duration: 0.3 } },
  out: { scale: 0, x: '-50%', y: '-50%', transition: { duration: 0.3 } }
};
const transition: Transition = {
  type: 'spring',
  stiffness: 10
};

const LoveButton: React.FC<LoveButtonProps> = ({ love, onLove }) => {
  return (
    <>
      <AnimatePresence>
        {love && (
          <motion.span
            style={{ position: 'absolute', left: '50%', top: '50%' }}
            variants={variants}
            transition={transition}
            initial="out"
            animate="in"
            exit="out"
            onClick={() => onLove(false)}
          >
            <FaHeart fill="#ff1450" size="1.2em" />
          </motion.span>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {!love && (
          <motion.span
            style={{ position: 'absolute', left: '50%', top: '50%' }}
            variants={variants}
            transition={transition}
            initial="out"
            animate="in"
            exit="out"
            onClick={() => onLove(true)}
          >
            <FaRegHeart color="#777" size="1.2em" />
          </motion.span>
        )}
      </AnimatePresence>
    </>
  );
};

export default LoveButton;
