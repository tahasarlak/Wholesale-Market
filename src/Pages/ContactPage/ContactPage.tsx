import React, { useState } from 'react';
import { Container, Typography, Box, Link, TextField, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import styles from './ContactPage.module.css';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: '', email: '', subject: '', message: '' };

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
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
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
      setTimeout(() => {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setSubmitStatus('idle'), 3000);
      }, 1000);
    } else {
      setSubmitStatus('error');
    }
  };

  return (
    <Container className={styles.contactPage}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <Typography variant="h3" className={styles.title}>
          Contact Us
        </Typography>
        <Typography variant="h6" className={styles.subtitle}>
          We're here to help with your wholesale needs. Reach out via the form below or use our contact details.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} className={styles.formContainer}>
          <TextField
            label="Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={!!errors.name}
            helperText={errors.name}
            className={styles.formField}
          />
          <TextField
            label="Email"
            fullWidth
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={!!errors.email}
            helperText={errors.email}
            className={styles.formField}
          />
          <TextField
            label="Subject"
            fullWidth
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            error={!!errors.subject}
            helperText={errors.subject}
            className={styles.formField}
          />
          <TextField
            label="Message"
            fullWidth
            multiline
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            error={!!errors.message}
            helperText={errors.message}
            className={styles.formField}
          />
          <Button type="submit" variant="contained" className={styles.submitButton}>
            Submit
          </Button>
          {submitStatus === 'success' && (
            <Typography className={styles.successMessage}>
              Form submitted successfully!
            </Typography>
          )}
          {submitStatus === 'error' && (
            <Typography className={styles.errorMessage}>
              Form submission failed. Please check your inputs.
            </Typography>
          )}
        </Box>

        <div className="flex flex-wrap gap-4 justify-center mt-8">
          <div className={`${styles.infoContainer} ${styles.infoContainerSm} ${styles.infoContainerMd}`}>
            <Box className={styles.contactInfo}>
              <Typography variant="h5" className={styles.contactInfoTitle}>
                Contact Information
              </Typography>
              <Box className={styles.contactInfoItem}>
                <FontAwesomeIcon icon={faPhone} className={styles.contactInfoIcon} />
                <Typography>+1 (123) 456-7890</Typography>
              </Box>
              <Box className={styles.contactInfoItem}>
                <FontAwesomeIcon icon={faEnvelope} className={styles.contactInfoIcon} />
                <Typography>support@wholesalemarket.com</Typography>
              </Box>
              <Box className={styles.contactInfoItem}>
                <FontAwesomeIcon icon={faMapMarkerAlt} className={styles.contactInfoIcon} />
                <Typography>123 Wholesale St, Business City, USA</Typography>
              </Box>
              <Typography variant="h6" className={styles.socialMediaTitle}>
                Follow Us
              </Typography>
              <Box className={styles.socialMediaIcons}>
                <Link href="https://facebook.com" target="_blank" className={styles.socialMediaIcon}>
                  <FontAwesomeIcon icon={faFacebook} />
                </Link>
                <Link href="https://twitter.com" target="_blank" className={styles.socialMediaIcon}>
                  <FontAwesomeIcon icon={faTwitter} />
                </Link>
                <Link href="https://instagram.com" target="_blank" className={styles.socialMediaIcon}>
                  <FontAwesomeIcon icon={faInstagram} />
                </Link>
              </Box>
            </Box>
          </div>
        </div>
      </motion.div>
    </Container>
  );
};

export default ContactPage;