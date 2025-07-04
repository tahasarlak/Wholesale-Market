import React, { useContext, useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Fab } from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { ThemeContext, ThemeContextType } from './context/ThemeContext';
import styles from './Layout.module.css';

const Layout: React.FC = () => {
  const { isDarkMode } = useContext(ThemeContext) as ThemeContextType;
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`${styles.layout} ${isDarkMode ? styles.dark : styles.light}`}>
      <Helmet>
        <title>Wholesale Market - Best Deals Online</title>
        <meta name="description" content="Your one-stop shop for wholesale products with unbeatable prices." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <Header />
      <main role="main" aria-label="Main content">
        <Outlet />
      </main>
      <Footer />
      {showScrollTop && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Fab
            className={styles.scrollTopButton}
            aria-label="Scroll to top"
            onClick={handleScrollTop}
          >
            <KeyboardArrowUp />
          </Fab>
        </motion.div>
      )}
    </div>
  );
};

export default Layout;