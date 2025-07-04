import React, { useContext } from 'react';
import { Container, Typography, Link as MuiLink, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { motion, useReducedMotion, Variants } from 'framer-motion';
import { ThemeContext, ThemeContextType } from '../../context/ThemeContext';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  const { isDarkMode } = useContext(ThemeContext) as ThemeContextType;
  const shouldReduceMotion = useReducedMotion();

  // Animation variants for footer
  const footerVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 1,
        ease: 'easeOut' as const,
      },
    },
  };

  // Animation variants for sections
  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.8,
        ease: 'easeOut' as const,
      },
    },
  };

  // Animation variants for social icons
  const iconVariants: Variants = {
    rest: { scale: 1 },
    hover: {
      scale: shouldReduceMotion ? 1 : 1.2,
      rotate: shouldReduceMotion ? 0 : 10,
      transition: { duration: shouldReduceMotion ? 0 : 0.3, ease: 'easeOut' as const },
    },
  };

  return (
    <motion.footer
      className={`${styles.footer} ${isDarkMode ? styles.dark : styles.light}`}
      variants={footerVariants}
      initial="hidden"
      animate="visible"
      role="contentinfo"
      aria-label="Website footer"
    >
      <Container maxWidth="lg" className={styles.container}>
        <div className={styles.sections}>
          {/* Company Info */}
          <motion.div variants={sectionVariants} initial="hidden" animate="visible" className={styles.section}>
            <Typography variant="h6" component="h2" className={styles.sectionTitle}>
              Wholesale Market
            </Typography>
            <Typography variant="body2" className={styles.sectionText}>
              Your trusted source for bulk products at unbeatable prices.
            </Typography>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={sectionVariants} initial="hidden" animate="visible" className={styles.section}>
            <Typography variant="h6" component="h2" className={styles.sectionTitle}>
              Quick Links
            </Typography>
            <Box className={styles.links}>
              <MuiLink
                component={RouterLink}
                to="/"
                className={styles.link}
                aria-label="Go to Home page"
              >
                Home
              </MuiLink>
              <MuiLink
                component={RouterLink}
                to="/products"
                className={styles.link}
                aria-label="Go to Products page"
              >
                Products
              </MuiLink>
              <MuiLink
                component={RouterLink}
                to="/categories"
                className={styles.link}
                aria-label="Go to Categories page"
              >
                Categories
              </MuiLink>
              <MuiLink
                component={RouterLink}
                to="/contact"
                className={styles.link}
                aria-label="Go to Contact page"
              >
                Contact
              </MuiLink>
            </Box>
          </motion.div>

          {/* Social Media and Contact */}
          <motion.div variants={sectionVariants} initial="hidden" animate="visible" className={styles.section}>
            <Typography variant="h6" component="h2" className={styles.sectionTitle}>
              Follow Us
            </Typography>
            <Box className={styles.socialIcons}>
              <motion.div variants={iconVariants} initial="rest" whileHover="hover">
                <MuiLink
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label="Visit our Facebook page"
                >
                  <FontAwesomeIcon icon={faFacebook} className={styles.socialIcon} />
                </MuiLink>
              </motion.div>
              <motion.div variants={iconVariants} initial="rest" whileHover="hover">
                <MuiLink
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label="Visit our Twitter page"
                >
                  <FontAwesomeIcon icon={faTwitter} className={styles.socialIcon} />
                </MuiLink>
              </motion.div>
              <motion.div variants={iconVariants} initial="rest" whileHover="hover">
                <MuiLink
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label="Visit our Instagram page"
                >
                  <FontAwesomeIcon icon={faInstagram} className={styles.socialIcon} />
                </MuiLink>
              </motion.div>
            </Box>
            <Typography variant="body2" className={styles.sectionText}>
              Email:{' '}
              <MuiLink
                href="mailto:support@wholesale.com"
                className={styles.link}
                aria-label="Email support"
              >
                support@wholesale.com
              </MuiLink>
              <br />
              Phone:{' '}
              <MuiLink
                href="tel:+18001234567"
                className={styles.link}
                aria-label="Call support"
              >
                +1-800-123-4567
              </MuiLink>
            </Typography>
          </motion.div>
        </div>

        <Typography variant="body2" className={styles.copyright}>
          © {new Date().getFullYear()} Wholesale Market. All rights reserved.
        </Typography>
      </Container>
    </motion.footer>
  );
};

export default Footer;