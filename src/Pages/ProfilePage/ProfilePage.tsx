import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import styles from './ProfilePage.module.css';

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container className={styles.profilePage}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <Typography variant="h3" className={styles.title}>
          {t('profile.title')}
        </Typography>
        <Box className={styles.contentContainer}>
          <Typography variant="body1" className={styles.description}>
            {t('profile.description')}
          </Typography>
          <Typography variant="body2" className={styles.placeholder}>
            {t('profile.placeholder')}
          </Typography>
        </Box>
      </motion.div>
    </Container>
  );
};

export default ProfilePage;