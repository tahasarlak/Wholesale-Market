import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Card, Typography, Box, Tabs, Tab } from '@mui/material';
import { motion, useReducedMotion, Variants } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { ProductContext, ProductContextType } from '../../context/ProductContext';
import ProductCard from '../ProductCard/ProductCard';
import styles from './FeaturedProducts.module.css';

const FeaturedProducts: React.FC = () => {
  const { t } = useTranslation();
  const { products, isLoading, error, addToCart } = useContext(ProductContext) as ProductContextType;
  const shouldReduceMotion = useReducedMotion();
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Unique categories from products
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map((p) => p.category)));
    return ['All', ...uniqueCategories];
  }, [products]);

  // Filter products by selected category
  const filteredProducts = useMemo(() => {
    return selectedCategory === 'All'
      ? products
      : products.filter((product) => product.category === selectedCategory);
  }, [products, selectedCategory]);

  // Animation variants for section
  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.8,
        ease: 'easeOut' as const,
        delay: 0.2,
      },
    },
  };

  // Animation variants for cards
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20, scale: shouldReduceMotion ? 1 : 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: shouldReduceMotion ? 0 : 0.5, ease: 'easeOut' as const, staggerChildren: 0.1 },
    },
  };

  // Handle add to cart
  const handleAddToCart = (productId: number, productName: string) => {
    addToCart(productId, 1); // Default quantity of 1
    toast.success(t('product.addedToCart', { name: productName, quantity: 1 }));
  };

  if (isLoading) {
    return (
      <Box className={styles.loadingContainer}>
        <Typography variant="h6" align="center">
          {t('products.loading')}
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className={styles.errorContainer}>
        <Typography variant="h6" align="center" className={styles.errorMessage}>
          {t('products.error.noProductContext')}
        </Typography>
      </Box>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <Box className={styles.noProductsContainer}>
        <Typography variant="h6" align="center">
          {t('products.noProducts')}
        </Typography>
      </Box>
    );
  }

  return (
    <motion.section
      className={styles.featuredProducts}
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      aria-labelledby="featured-products-heading"
    >
      <Typography
        variant="h4"
        component="h2"
        id="featured-products-heading"
        className={styles.title}
      >
        {t('products.title')}
      </Typography>
      <Box className={styles.tabContainer}>
        <Tabs
          value={selectedCategory}
          onChange={(e, newValue) => setSelectedCategory(newValue)}
          centered
          textColor="primary"
          indicatorColor="primary"
          aria-label={t('products.categoryAria')}
        >
          {categories.map((category) => (
            <Tab
              key={category}
              label={t(`products.categories.${category.toLowerCase()}`, { defaultValue: category })}
              value={category}
              className={styles.tab}
              aria-selected={selectedCategory === category}
            />
          ))}
        </Tabs>
      </Box>
      <Box className={styles.productGrid}>
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            className={styles.productItem}
            variants={cardVariants}
          >
            <ProductCard
              product={product}
              cardVariants={cardVariants}
              handleAddToCart={handleAddToCart}
            />
          </motion.div>
        ))}
      </Box>
    </motion.section>
  );
};

export default FeaturedProducts;