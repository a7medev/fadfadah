import { motion, Variants, Transition } from 'framer-motion';

const pageVariants: Variants = {
  exit: {
    x: '100vw'
  },
  in: {
    x: '0'
  },
  out: {
    x: '-100vw'
  }
}
const pageTransition: Transition = {
  type: 'tween',
  ease: 'linear'
}

const PageTransition: React.FC = ({ children }) => {
  return (
    <motion.div
      initial="out"
      animate="in"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
      style={{ overflowX: 'hidden' }}
    >
      {children}
    </motion.div>
  );
}
 
export default PageTransition;
