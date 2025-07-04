import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import Banner from '../../components/Banner/Banner';
import FeaturedProducts from '../../components/FeaturedProducts/FeaturedProducts';
import ContactSection from '../../components/ContactSection/ContactSection';
import styles from './HomePage.module.css';
import CategoriesSection from '../../components/CategoriesSection/CategoriesSection';
import Testimonials from '../../components/Testimonials/Testimonials';

const HomePage: React.FC = () => {
  return (
    <div className={styles.homePage}>
      <Banner />
      <Container className={styles.container}>
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={styles.welcomeSection}
        >
          <Typography variant="h3" className={styles.welcomeTitle}>
            Welcome to Wholesale Market
          </Typography>
          <Typography variant="h6" className={styles.welcomeText}>
            Discover unbeatable deals on bulk products tailored for your business needs.
          </Typography>
          <Box className={styles.exploreButtonContainer}>
            <Button
              variant="contained"
              component={RouterLink}
              to="/products"
              className={styles.exploreButton}
            >
              Explore Products
            </Button>
          </Box>
        </motion.div>

        {/* Featured Products */}
        <FeaturedProducts />

        {/* Categories */}
        <CategoriesSection />

        {/* Testimonials */}
        <Testimonials />

        {/* Contact Section */}
        <ContactSection />
      </Container>
    </div>
  );
};

export default HomePage;