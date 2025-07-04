import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { AuthContext, AuthContextType } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import styles from './LoginPage.module.css';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const { toggleAuth, isAuthenticated } = useContext(AuthContext) as AuthContextType;

  return (
    <Container className={styles.loginPage}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <Typography variant="h3" className={styles.title}>
          {t('login.title')}
        </Typography>
        <Box className={styles.contentContainer}>
          <Typography variant="body1" paragraph>
            {isAuthenticated ? t('login.alreadyLoggedIn') : t('login.prompt')}
          </Typography>
          <Button
            variant="contained"
            onClick={toggleAuth}
            className={styles.loginButton}
            aria-label={isAuthenticated ? t('login.logout') : t('login.login')}
          >
            {isAuthenticated ? t('login.logout') : t('login.login')}
          </Button>
        </Box>
      </motion.div>
    </Container>
  );
};

export default LoginPage;