import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { motion, useReducedMotion, Variants } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import styles from './Testimonials.module.css';

interface Testimonial {
  name: string;
  text: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'John Doe',
    text: 'testimonials.johnDoe',
    avatar: 'https://source.unsplash.com/random/100x100/?person',
  },
  {
    name: 'Jane Smith',
    text: 'testimonials.janeSmith',
    avatar: 'https://source.unsplash.com/random/100x100/?woman',
  },
  {
    name: 'Mike Johnson',
    text: 'testimonials.mikeJohnson',
    avatar: 'https://source.unsplash.com/random/100x100/?man',
  },
];

const Testimonials: React.FC = () => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const [avatarStatus, setAvatarStatus] = useState<Record<string, boolean>>({});

  // Check avatar image loading status
  useEffect(() => {
    const status: Record<string, boolean> = {};
    testimonials.forEach((testimonial, index) => {
      const img = new Image();
      img.src = testimonial.avatar;
      img.onload = () => setAvatarStatus((prev) => ({ ...prev, [index]: true }));
      img.onerror = () => setAvatarStatus((prev) => ({ ...prev, [index]: false }));
    });
  }, []);

  // Animation variants for section
  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.8,
        ease: 'easeOut' as const,
        delay: 0.5,
      },
    },
  };

  // Animation variants for testimonial cards
  const cardVariants: Variants = {
    rest: { scale: 1 },
    hover: {
      scale: shouldReduceMotion ? 1 : 1.03,
      boxShadow: shouldReduceMotion ? '' : '0 8px 16px rgba(0,0,0,0.2)',
      transition: { duration: shouldReduceMotion ? 0 : 0.3, ease: 'easeOut' as const },
    },
  };

  return (
    <motion.section
      className={styles.testimonials}
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      aria-labelledby="testimonials-heading"
    >
      <Typography
        variant="h4"
        component="h2"
        id="testimonials-heading"
        className={styles.title}
      >
        {t('testimonials.title')}
      </Typography>
      <div className={styles.testimonialGrid}>
        {testimonials.map((testimonial, index) => (
          <div key={index} className={styles.testimonialItem}>
            <motion.div
              className={styles.cardWrapper}
              variants={cardVariants}
              initial="rest"
              whileHover="hover"
            >
              <Box className={styles.testimonialCard}>
                <Avatar
                  src={avatarStatus[index] !== false ? testimonial.avatar : undefined}
                  alt={testimonial.name}
                  className={styles.avatar}
                  style={{
                    background: avatarStatus[index] === false
                      ? 'linear-gradient(to right, var(--primary-color), var(--accent-color))'
                      : undefined,
                  }}
                  aria-describedby={avatarStatus[index] === false ? `avatar-error-${index}` : undefined}
                />
                <Typography variant="body1" className={styles.testimonialText}>
                  "{t(testimonial.text)}"
                </Typography>
                <Typography variant="subtitle2" className={styles.testimonialName}>
                  {testimonial.name}
                </Typography>
                {avatarStatus[index] === false && (
                  <Typography
                    id={`avatar-error-${index}`}
                    className={styles.avatarError}
                    variant="caption"
                  >
                    {t('testimonials.avatarError')}
                  </Typography>
                )}
              </Box>
            </motion.div>
          </div>
        ))}
      </div>
    </motion.section>
  );
};

export default Testimonials;