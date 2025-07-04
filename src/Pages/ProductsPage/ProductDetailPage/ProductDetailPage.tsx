import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  CardMedia,
  TextField,
  IconButton,
  CircularProgress,
  Rating,
  Breadcrumbs,
  Link as MuiLink,
  Chip,
} from '@mui/material';
import { motion, useReducedMotion, Variants } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faChevronLeft, faChevronRight, faHeart } from '@fortawesome/free-solid-svg-icons';
import { Helmet } from 'react-helmet-async';
import { Product, ProductContext, ProductContextType } from '../../../context/ProductContext';
import { ThemeContext, ThemeContextType } from '../../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import styles from './ProductDetailPage.module.css';
import ProductCard from '../../../components/ProductCard/ProductCard';

const ProductDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart } = useContext(ProductContext) as ProductContextType;
  const { isDarkMode } = useContext(ThemeContext) as ThemeContextType;
  const shouldReduceMotion = useReducedMotion();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean | null>(null);

  // Animation variants
  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0 : 0.8, ease: 'easeOut' as const },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20, scale: shouldReduceMotion ? 1 : 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: shouldReduceMotion ? 0 : 0.5, ease: 'easeOut' as const, staggerChildren: 0.1 },
    },
  };

  useEffect(() => {
    setIsLoading(true);
    const foundProduct = products.find((p) => p.id === parseInt(id || '0', 10));
    setProduct(foundProduct || null);
    setCurrentImageIndex(0);
    setQuantity(1);
    setIsWishlisted(false);
    setImageLoaded(null);

    // Check image loading status
    if (foundProduct) {
      const imageSrc = foundProduct.images && foundProduct.images.length > 0 ? foundProduct.images[0] : foundProduct.image;
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => setImageLoaded(true);
      img.onerror = () => setImageLoaded(false);
    }

    setIsLoading(false);
  }, [id, products]);

  const handleAddToCart = (productId: number, productName: string) => {
    try {
      addToCart(productId, quantity);
      toast.success(t('product.addedToCart', { name: productName, quantity }));
      navigate('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(t('products.error.addToCart'));
    }
  };

  const handleWishlistToggle = () => {
    setIsWishlisted((prev) => !prev);
    toast.info(isWishlisted ? t('product.removedFromWishlist') : t('product.addedToWishlist'));
  };

  const handleImageChange = (direction: 'next' | 'prev') => {
    if (!product || !product.images || product.images.length <= 1) return;
    setCurrentImageIndex((prev) =>
      direction === 'next' ? (prev + 1) % product.images.length : (prev - 1 + product.images.length) % product.images.length
    );
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
    setImageLoaded(null);
    const img = new Image();
    img.src = product!.images![index];
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(false);
  };

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.id !== product.id && p.category === product.category)
      .slice(0, 3);
  }, [product, products]);

  const structuredData = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.images?.[currentImageIndex] || product.image,
        description: product.description || t('product.noDescription'),
        sku: product.id.toString(),
        offers: {
          '@type': 'Offer',
          priceCurrency: 'USD',
          price: parseFloat(product.price.replace('$', '') || '0'),
          availability: product.stockQuantity && product.stockQuantity > 0 ? 'http://schema.org/InStock' : 'http://schema.org/OutOfStock',
        },
        category: product.category,
        aggregateRating: product.rating
          ? {
              '@type': 'AggregateRating',
              ratingValue: product.rating,
              reviewCount: product.reviewCount || 1,
            }
          : undefined,
      }
    : {};

  if (isLoading) {
    return (
      <Container className={styles.loadingContainer}>
        <CircularProgress aria-label={t('product.loading')} />
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className={styles.productDetailPage}>
        <Typography variant="h5" align="center" className={styles.errorMessage}>
          {t('product.notFound')}
        </Typography>
      </Container>
    );
  }

  return (
    <motion.section
      className={`${styles.productDetailPage} ${isDarkMode ? styles.dark : styles.light}`}
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      role="main"
      aria-label={t('product.ariaLabel', { name: product.name })}
    >
      <Container maxWidth="xl" className={styles.container}>
        <Helmet>
          <title>{`${product.name} - Wholesale Market`}</title>
          <meta name="description" content={product.description || t('product.noDescription')} />
          <link rel="canonical" href={window.location.href} />
          <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        </Helmet>

        <Breadcrumbs aria-label={t('product.breadcrumbAria')} className={styles.breadcrumbs}>
          <MuiLink component={RouterLink} to="/" className={styles.breadcrumbLink}>
            {t('product.home')}
          </MuiLink>
          <MuiLink component={RouterLink} to="/products" className={styles.breadcrumbLink}>
            {t('product.products')}
          </MuiLink>
          <Typography className={styles.breadcrumbCurrent}>{product.name}</Typography>
        </Breadcrumbs>

        <Typography variant="h1" component="h1" className={styles.title}>
          {product.name}
        </Typography>

        <Box className={styles.productDetails}>
          <Box className={styles.imageSection}>
            <CardMedia
              component="img"
              image={
                imageLoaded !== false
                  ? (product.images && product.images.length > 0 ? product.images[currentImageIndex] : product.image)
                  : undefined
              }
              alt={product.name}
              className={styles.mainImage}
              loading="lazy"
              style={{
                background: imageLoaded === false ? 'linear-gradient(to right, var(--primary-color), var(--accent-color))' : undefined,
              }}
              aria-describedby={imageLoaded === false ? `image-error-${product.id}` : undefined}
            />
            {imageLoaded === false && (
              <Typography id={`image-error-${product.id}`} className={styles.imageError} variant="caption">
                {t('product.imageError')}
              </Typography>
            )}
            {product.images && product.images.length > 1 && (
              <Box className={styles.imageNavContainer}>
                <IconButton
                  onClick={() => handleImageChange('prev')}
                  className={styles.imageNavButton}
                  aria-label={t('product.prevImage')}
                  disabled={product.images.length <= 1}
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </IconButton>
                <IconButton
                  onClick={() => handleImageChange('next')}
                  className={styles.imageNavButton}
                  aria-label={t('product.nextImage')}
                  disabled={product.images.length <= 1}
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </IconButton>
              </Box>
            )}
            {product.images && product.images.length > 0 && (
              <Box className={styles.thumbnailContainer}>
                {product.images.map((image, index) => (
                  <Box
                    key={index}
                    component="img"
                    src={image}
                    alt={t('product.thumbnailAria', { index: index + 1, name: product.name })}
                    className={`${styles.thumbnail} ${currentImageIndex === index ? styles.activeThumbnail : ''}`}
                    onClick={() => handleThumbnailClick(index)}
                    role="button"
                    aria-label={t('product.selectThumbnail', { index: index + 1 })}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleThumbnailClick(index)}
                  />
                ))}
              </Box>
            )}
          </Box>

          <Box className={styles.infoSection}>
            <Box className={styles.statusContainer}>
              {product.isNew && (
                <Chip label={t('product.new')} color="success" size="small" className={styles.statusChip} />
              )}
              {product.isOnSale && (
                <Chip label={t('product.onSale')} color="error" size="small" className={styles.statusChip} />
              )}
              {product.stockQuantity !== undefined && (
                <Chip
                  label={product.stockQuantity > 0 ? t('product.inStock', { count: product.stockQuantity }) : t('product.outOfStock')}
                  color={product.stockQuantity > 0 ? 'primary' : 'default'}
                  size="small"
                  className={styles.statusChip}
                />
              )}
            </Box>
            <Typography variant="h5" className={styles.price}>
              {product.price}
            </Typography>
            {product.rating && (
              <Box className={styles.ratingContainer}>
                <Rating
                  value={product.rating}
                  readOnly
                  precision={0.5}
                  className={styles.rating}
                  aria-label={t('product.ratingAria', { rating: product.rating })}
                />
                <Typography variant="caption" className={styles.reviewCount}>
                  ({product.reviewCount} {t('product.reviews')})
                </Typography>
              </Box>
            )}
            <Typography variant="body1" className={styles.description}>
              {product.description || t('product.noDescription')}
            </Typography>
            <Typography variant="body2" className={styles.category}>
              {t('product.category')}: {product.category}
            </Typography>
            {product.variants && product.variants.length > 0 && (
              <Box className={styles.variantsContainer}>
                <Typography variant="h6" className={styles.variantsTitle}>
                  {t('product.variants')}
                </Typography>
                <Box className={styles.variantChips}>
                  {product.variants.map((variant, index) => (
                    <Chip
                      key={index}
                      label={variant.color || variant.size || t('product.unknownVariant')}
                      size="small"
                      className={styles.variantChip}
                      onClick={() => toast.info(t('product.variantSelected', { variant: variant.color || variant.size }))}
                    />
                  ))}
                </Box>
              </Box>
            )}
            {product.bulkPricing && product.bulkPricing.length > 0 && (
              <Box className={styles.bulkPricing}>
                <Typography variant="h6" className={styles.bulkPricingTitle}>
                  {t('product.bulkPricing')}
                </Typography>
                {product.bulkPricing.map((tier, index) => (
                  <Typography key={index} variant="body2" className={styles.bulkPricingItem}>
                    {t('product.bulkPricingTier', { minQuantity: tier.minQuantity, price: tier.price })}
                  </Typography>
                ))}
              </Box>
            )}
            <Box className={styles.actionContainer}>
              <TextField
                label={t('product.quantity')}
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                inputProps={{ min: 1, step: 1, max: product.stockQuantity || undefined }}
                className={styles.quantityInput}
                aria-label={t('product.quantityAria', { name: product.name })}
                disabled={product.stockQuantity === 0}
              />
              <Button
                variant="contained"
                startIcon={<FontAwesomeIcon icon={faShoppingCart} />}
                onClick={() => handleAddToCart(product.id, product.name)}
                className={styles.addToCartButton}
                aria-label={t('product.addToCartAria', { name: product.name, quantity })}
                disabled={product.stockQuantity === 0}
              >
                {t('product.addToCart')}
              </Button>
              <IconButton
                onClick={handleWishlistToggle}
                className={`${styles.wishlistButton} ${isWishlisted ? styles.activeWishlist : ''}`}
                aria-label={isWishlisted ? t('product.removeFromWishlist') : t('product.addToWishlist')}
              >
                <FontAwesomeIcon icon={faHeart} />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {relatedProducts.length > 0 && (
          <Box className={styles.relatedProducts}>
            <Typography variant="h4" component="h2" className={styles.relatedProductsTitle}>
              {t('product.relatedProducts')}
            </Typography>
            <Box className={styles.relatedProductsGrid}>
              {relatedProducts.map((related) => (
                <motion.div key={related.id} className={styles.relatedProductContainer} variants={cardVariants}>
                  <ProductCard
                    product={related}
                    cardVariants={cardVariants}
                    handleAddToCart={handleAddToCart}
                  />
                </motion.div>
              ))}
            </Box>
          </Box>
        )}
      </Container>
    </motion.section>
  );
};

export default ProductDetailPage;