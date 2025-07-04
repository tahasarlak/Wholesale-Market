import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion, useReducedMotion, Variants } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import styles from './Banner.module.css';

const Banner: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [imageLoaded, setImageLoaded] = useState(true);

  // Handle image load error
  useEffect(() => {
    const img = new Image();
    img.src = 'https://source.unsplash.com/random/1920x600/?wholesale';
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(false);
  }, []);

  // Animation variants with proper typing
  const bannerVariants: Variants = {
    hidden: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: shouldReduceMotion ? 0 : 1, 
        ease: 'easeOut' as const
      }
    }
  };

  return (
    <Box
      className={styles.banner}
      style={{
        backgroundImage: imageLoaded 
          ? `url(https://source.unsplash.com/random/1920x600/?wholesale)`
          : 'linear-gradient(to right, var(--primary-color), var(--accent-color))',
      }}
      role="banner"
      aria-label="Promotional banner for wholesale products"
    >
      <motion.div
        className={styles.bannerContent}
        variants={bannerVariants}
        initial="hidden"
        animate="visible"
      >
        <Typography
          variant="h1"
          component="h1"
          className={styles.bannerTitle}
        >
          Bulk Deals, Made Simple
        </Typography>
        <Typography
          variant="h5"
          component="p"
          className={styles.bannerSubtitle}
        >
          Shop wholesale products at unbeatable prices.
        </Typography>
        <Box className={styles.buttonContainer}>
          <Button
            variant="contained"
            component={RouterLink}
            to="/products"
            className={styles.shopButton}
            aria-label="Shop wholesale products"
          >
            Shop Now
          </Button>
          <Button
            variant="outlined"
            component={RouterLink}
            to="/contact"
            className={styles.contactButton}
            aria-label="Contact us for more information"
          >
            Contact Us
          </Button>
        </Box>
      </motion.div>
      {!imageLoaded && (
        <Box className={styles.imageError}>
          Image failed to load. Using fallback background.
        </Box>
      )}
    </Box>
  );
};

export default Banner;