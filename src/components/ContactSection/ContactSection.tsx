import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Box, Alert } from '@mui/material';
import { motion, useReducedMotion, Variants } from 'framer-motion';
import styles from './ContactSection.module.css';

const ContactSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle');

  // Reset submit status after a timeout
  useEffect(() => {
    if (submitStatus === 'success' || submitStatus === 'error') {
      const timer = setTimeout(() => setSubmitStatus('idle'), 3000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: '', email: '', message: '' };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (validateForm()) {
      setSubmitStatus('loading');
      // Simulate API call
      setTimeout(() => {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
      }, 1000);
    } else {
      setSubmitStatus('error');
    }
  };

  // Animation variants for section
  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.8,
        ease: 'easeOut' as const,
        delay: 0.4,
      },
    },
  };

  return (
    <motion.section
      className={styles.contactSection}
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      aria-labelledby="contact-heading"
    >
      <Typography
        variant="h4"
        component="h2"
        id="contact-heading"
        className={styles.title}
      >
        Get in Touch
      </Typography>
      <Container maxWidth="sm" className={styles.formContainer}>
        {submitStatus === 'success' && (
          <Alert
            severity="success"
            className={styles.alert}
            role="alert"
            aria-live="polite"
          >
            Message sent successfully!
          </Alert>
        )}
        {submitStatus === 'error' && (
          <Alert
            severity="error"
            className={styles.alert}
            role="alert"
            aria-live="polite"
          >
            Please fix the errors in the form.
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={!!errors.name}
            helperText={errors.name}
            className={styles.textField}
            aria-required="true"
            inputProps={{ 'aria-describedby': errors.name ? 'name-error' : undefined }}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            variant="outlined"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={!!errors.email}
            helperText={errors.email}
            className={styles.textField}
            aria-required="true"
            inputProps={{ 'aria-describedby': errors.email ? 'email-error' : undefined }}
          />
          <TextField
            label="Message"
            fullWidth
            margin="normal"
            variant="outlined"
            multiline
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            error={!!errors.message}
            helperText={errors.message}
            className={styles.textField}
            aria-required="true"
            inputProps={{ 'aria-describedby': errors.message ? 'message-error' : undefined }}
          />
          <Button
            variant="contained"
            type="submit"
            fullWidth
            className={styles.submitButton}
            disabled={submitStatus === 'loading'}
            aria-label="Send contact message"
          >
            {submitStatus === 'loading' ? 'Sending...' : 'Send Message'}
          </Button>
        </Box>
      </Container>
    </motion.section>
  );
};

export default ContactSection;