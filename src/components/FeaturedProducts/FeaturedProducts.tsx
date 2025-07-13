import React, { useContext, useState, useMemo } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import { motion, useReducedMotion, Variants } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { ProductContext, ProductContextType } from '../../context/ProductContext';
import { AuthContext, AuthContextType, UserRole } from '../../context/AuthContext';
import ProductCard from '../ProductCard/ProductCard';
import styles from './FeaturedProducts.module.css';

const FeaturedProducts: React.FC = () => {
  const { t } = useTranslation();
  const { products, isLoading, error, submitPurchaseRequest } = useContext(ProductContext) as ProductContextType;
  const { user, switchRole } = useContext(AuthContext) as AuthContextType;
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

  // Handle purchase request
  const handlePurchaseRequest = async (
    productId: number,
    productName: string,
    quantity: number = 1,
    proposedPrice?: string
  ) => {
    if (!user) {
      toast.error(t('products.pleaseLogin'));
      return;
    }
    if (user.roles.includes(UserRole.SELLER) && user.activeRole !== UserRole.BUYER) {
      toast.info(t('products.switchToBuyer'));
      switchRole(UserRole.BUYER);
    }
    try {
      await submitPurchaseRequest(productId, quantity, { email: user.email }, proposedPrice);
      toast.success(t('products.purchaseRequestSent', { name: productName, quantity }));
    } catch (err) {
      toast.error(t('products.purchaseRequestFailed'));
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
        ease: 'easeOut',
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
      transition: { duration: shouldReduceMotion ? 0 : 0.5, ease: 'easeOut', staggerChildren: 0.1 },
    },
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
          {error}
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
              handlePurchaseRequest={handlePurchaseRequest}
            />
          </motion.div>
        ))}
      </Box>
    </motion.section>
  );
};

export default FeaturedProducts;