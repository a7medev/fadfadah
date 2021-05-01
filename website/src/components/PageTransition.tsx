import { motion, Variants, Transition } from 'framer-motion';

const pageVariants: Variants = {
  exit: { x: '100vw', overflow: 'hidden' },
  in: { x: '0', overflow: 'visible' },
  out: { x: '-100vw', overflow: 'hidden' }
};

const pageTransition: Transition = {
  type: 'tween',
  ease: 'linear'
};

const PageTransition: React.FC = ({ children }) => {
  return (
    <motion.div
      initial="out"
      animate="in"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
