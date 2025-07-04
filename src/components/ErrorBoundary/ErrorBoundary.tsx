import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Alert,
  AlertTitle,
  IconButton,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Home as HomeIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { motion, useReducedMotion, Variants } from 'framer-motion';
import styles from './ErrorBoundary.module.css';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children, fallback, onReset }) => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const [state, setState] = useState<ErrorBoundaryState>({
    hasError: false,
    error: null,
    errorInfo: null,
  });

  useEffect(() => {
    const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
      console.error('ErrorBoundary caught an error:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      });

      toast.error(t('errorBoundary.message'), {
        toastId: 'error-boundary',
        position: 'top-center',
        autoClose: 5000,
      });

      setState({ hasError: true, error, errorInfo });
    };

    // Simulate componentDidCatch with window error event
    const errorHandler = (event: ErrorEvent) => {
      handleError(event.error, { componentStack: event.error.stack || '' });
    };

    window.addEventListener('error', errorHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, [t]);

  const handleReset = () => {
    setState({ hasError: false, error: null, errorInfo: null });
    if (onReset) {
      onReset();
    }
  };

  // Animation variants for error container
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.5,
        ease: 'easeOut' as const,
      },
    },
  };

  if (state.hasError) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <motion.div
        className={styles.errorContainer}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        role="alert"
        aria-live="assertive"
      >
        <Container maxWidth="sm" className={styles.container}>
          <Box className={styles.content}>
            <Alert
              severity="error"
              className={styles.errorAlert}
              action={
                <IconButton
                  aria-label={t('errorBoundary.retry')}
                  onClick={handleReset}
                  color="inherit"
                  size="small"
                >
                  <RefreshIcon />
                </IconButton>
              }
            >
              <AlertTitle className={styles.alertTitle}>
                {t('errorBoundary.title')}
              </AlertTitle>
              <Typography variant="body1" className={styles.errorMessage}>
                {t('errorBoundary.message')}
              </Typography>
              {process.env.NODE_ENV === 'development' && state.error && (
                <Typography variant="caption" className={styles.errorDetails}>
                  {state.error.message}
                  <br />
                  {state.errorInfo?.componentStack}
                </Typography>
              )}
            </Alert>
            <Button
              variant="contained"
              component={RouterLink}
              to="/"
              startIcon={<HomeIcon />}
              className={styles.homeButton}
              aria-label={t('errorBoundary.backToHome')}
            >
              {t('errorBoundary.backToHome')}
            </Button>
          </Box>
        </Container>
      </motion.div>
    );
  }

  return <>{children}</>;
};

export default ErrorBoundary;