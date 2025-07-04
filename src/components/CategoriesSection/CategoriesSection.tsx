import React, { useState, useEffect } from 'react';
import { Card, CardMedia, Typography, Box, Button } from '@mui/material';
import { motion, useReducedMotion, Variants } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import styles from './CategoriesSection.module.css';

interface Category {
  name: string;
  image: string;
  path: string;
}

const categories: Category[] = [
  { name: 'Electronics', image: 'https://source.unsplash.com/random/300x200/?electronics', path: '/categories/electronics' },
  { name: 'Clothing', image: 'https://source.unsplash.com/random/300x200/?clothing', path: '/categories/clothing' },
  { name: 'Home & Garden', image: 'https://source.unsplash.com/random/300x200/?home', path: '/categories/home-garden' },
];

const CategoriesSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [imageStatus, setImageStatus] = useState<Record<string, boolean>>({});

  // Check image loading status
  useEffect(() => {
    const status: Record<string, boolean> = {};
    categories.forEach((category) => {
      const img = new Image();
      img.src = category.image;
      img.onload = () => setImageStatus((prev) => ({ ...prev, [category.name]: true }));
      img.onerror = () => setImageStatus((prev) => ({ ...prev, [category.name]: false }));
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
        delay: 0.3,
      },
    },
  };

  // Animation variants for cards
  const cardVariants: Variants = {
    rest: { scale: 1, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' },
    hover: {
      scale: shouldReduceMotion ? 1 : 1.05,
      boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
      transition: { duration: shouldReduceMotion ? 0 : 0.3, ease: 'easeOut' as const },
    },
  };

  return (
    <motion.section
      className={styles.categoriesSection}
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      aria-labelledby="categories-heading"
    >
      <Typography
        variant="h4"
        component="h2"
        id="categories-heading"
        className={styles.title}
      >
        Shop by Category
      </Typography>
      <div className={styles.gridContainer}>
        {categories.map((category) => (
          <div key={category.name} className={styles.gridItem}>
            <motion.div
              className={styles.cardWrapper}
              variants={cardVariants}
              initial="rest"
              whileHover="hover"
            >
              <Card className={styles.card}>
                <CardMedia
                  component="img"
                  image={imageStatus[category.name] !== false ? category.image : undefined}
                  alt={category.name}
                  className={styles.cardImage}
                  style={{
                    background: imageStatus[category.name] === false 
                      ? 'linear-gradient(to right, var(--primary-color), var(--accent-color))' 
                      : undefined,
                  }}
                  aria-describedby={`image-error-${category.name}`}
                />
                <Box className={styles.cardContent}>
                  <Typography variant="h6" component="h3" className={styles.cardTitle}>
                    {category.name}
                  </Typography>
                  <Button
                    component={RouterLink}
                    to={category.path}
                    className={styles.exploreButton}
                    aria-label={`Explore ${category.name} category`}
                  >
                    Explore
                  </Button>
                </Box>
                {imageStatus[category.name] === false && (
                  <Typography
                    id={`image-error-${category.name}`}
                    className={styles.imageError}
                  >
                    Image failed to load
                  </Typography>
                )}
              </Card>
            </motion.div>
          </div>
        ))}
      </div>
    </motion.section>
  );
};

export default CategoriesSection;