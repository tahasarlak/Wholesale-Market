import React, { useContext, useState, useEffect } from 'react';
import { Card, CardMedia, CardContent, Typography, Button, Rating, Chip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { motion, useReducedMotion, Variants } from 'framer-motion';
import { Product } from '../../context/ProductContext';
import { ThemeContext, ThemeContextType } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
  cardVariants: Variants;
  handleAddToCart: (productId: number, productName: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, cardVariants, handleAddToCart }) => {
  const { t } = useTranslation();
  const { isDarkMode } = useContext(ThemeContext) as ThemeContextType;
  const shouldReduceMotion = useReducedMotion();
  const [imageLoaded, setImageLoaded] = useState<boolean | null>(null);

  // Check image loading status
  useEffect(() => {
    const img = new Image();
    const imageSrc = product.images && product.images.length > 0 ? product.images[0] : product.image;
    img.src = imageSrc;
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(false);
  }, [product.images, product.image]);

  // Animation variants for buttons
  const buttonVariants: Variants = {
    rest: { scale: 1 },
    hover: {
      scale: shouldReduceMotion ? 1 : 1.05,
      transition: { duration: shouldReduceMotion ? 0 : 0.3, ease: 'easeOut' as const },
    },
  };

  return (
    <motion.div
      className={styles.cardWrapper}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={shouldReduceMotion ? {} : { scale: 1.05, boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
    >
      <Card className={`${styles.card} ${isDarkMode ? styles.cardDark : styles.cardLight}`}>
        <CardMedia
          component="img"
          image={imageLoaded !== false ? (product.images && product.images.length > 0 ? product.images[0] : product.image) : undefined}
          alt={product.name}
          className={styles.cardMedia}
          loading="lazy"
          style={{
            background: imageLoaded === false ? 'linear-gradient(to right, var(--primary-color), var(--accent-color))' : undefined,
          }}
          aria-describedby={imageLoaded === false ? `image-error-${product.id}` : undefined}
        />
        <CardContent className={styles.cardContent}>
          <Typography variant="subtitle2" className={styles.cardCategory}>
            {product.category}
          </Typography>
          <Typography variant="h6" component="h3" className={styles.cardTitle}>
            {product.name}
          </Typography>
          <Typography variant="body2" className={styles.cardDescription}>
            {product.description?.substring(0, 50) || t('product.noDescription')}...
          </Typography>
          <Typography variant="body2" className={styles.cardPrice}>
            {product.price}
            {product.bulkPricing && product.bulkPricing.length > 0 && (
              <Typography variant="caption" component="span" className={styles.bulkPrice}>
                {` (${t('product.bulkPrice', { price: product.bulkPricing[0].price })})`}
              </Typography>
            )}
          </Typography>
          {product.rating && (
            <div className={styles.ratingContainer}>
              <Rating
                value={product.rating}
                readOnly
                precision={0.5}
                size="small"
                className={styles.cardRating}
                aria-label={t('product.ratingAria', { rating: product.rating })}
              />
              <Typography variant="caption" className={styles.reviewCount}>
                ({product.reviewCount} {t('product.reviews')})
              </Typography>
            </div>
          )}
          {product.bulkPricing && (
            <Chip
              label={t('product.bulkAvailable')}
              color="primary"
              size="small"
              className={styles.bulkChip}
              aria-label={t('product.bulkAvailableAria')}
            />
          )}
          <div className={styles.buttonContainer}>
            <motion.div variants={buttonVariants} initial="rest" whileHover="hover">
              <Button
                variant="contained"
                component={RouterLink}
                to={`/products/${product.id}`}
                className={styles.viewDetailsButton}
                aria-label={t('product.viewDetailsAria', { name: product.name })}
              >
                {t('product.viewDetails')}
              </Button>
            </motion.div>
            <motion.div variants={buttonVariants} initial="rest" whileHover="hover">
              <Button
                variant="outlined"
                onClick={() => handleAddToCart(product.id, product.name)}
                className={styles.addToCartButton}
                aria-label={t('product.addToCartAria', { name: product.name })}
              >
                {t('product.addToCart')}
              </Button>
            </motion.div>
          </div>
          {imageLoaded === false && (
            <Typography
              id={`image-error-${product.id}`}
              className={styles.imageError}
              variant="caption"
            >
              {t('product.imageError')}
            </Typography>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;