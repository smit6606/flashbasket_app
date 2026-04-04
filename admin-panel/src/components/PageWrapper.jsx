import { motion } from 'framer-motion';
import { Box } from '@mui/material';

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      <Box sx={{ pb: 6 }}>
        {children}
      </Box>
    </motion.div>
  );
};

export default PageWrapper;
