import { motion, Variants } from 'framer-motion';

const fadeVariants: Variants = {
  out: { opacity: 0 },
  in: { opacity: 1 }
};

const FadeTransition: React.FC = ({ children }) => {
  return (
    <motion.div initial="out" animate="in" variants={fadeVariants}>
      {children}
    </motion.div>
  );
};

export default FadeTransition;
