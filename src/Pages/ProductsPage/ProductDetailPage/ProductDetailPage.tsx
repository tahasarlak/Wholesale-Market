import React, { useContext, useState, useEffect, startTransition } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Chip,
  Rating,
  Breadcrumbs,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import { NavigateNext, ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion, Variants } from 'framer-motion';
import ProductCard from '../../../components/ProductCard/ProductCard';
import { ProductContext, ProductContextType } from '../../../context/ProductContext';
import { AuthContext, AuthContextType, UserRole } from '../../../context/AuthContext';
import { WishlistContext, WishlistContextType } from '../../../context/WishlistContext';
import { toast } from 'react-toastify';
import styles from './ProductDetailPage.module.css';

const ProductDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, sellers, submitPurchaseRequest } = useContext(ProductContext) as ProductContextType;
  const { user, isAuthenticated, switchRole } = useContext(AuthContext) as AuthContextType;
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext) as WishlistContextType;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [proposedPrice, setProposedPrice] = useState<string | undefined>(undefined);
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(undefined);
  const [imageLoaded, setImageLoaded] = useState<boolean | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const product = products.find((p) => p.id === parseInt(id || '0'));
  const seller = sellers.find((s) => s.id === product?.sellerId);

  useEffect(() => {
    if (!product) return;
    const imageToLoad = product.images && product.images.length > 0
      ? product.images[currentImageIndex]
      : product.image;
    const img = new Image();
    img.src = imageToLoad;
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(false);
  }, [product, currentImageIndex]);

  const handlePurchaseRequest = async (method: 'email' | 'whatsapp' | 'telegram') => {
    if (!isAuthenticated || !user) {
      toast.error(t('products.pleaseLogin'));
      startTransition(() => {
        navigate('/login');
      });
      return;
    }
    if (user.roles.includes(UserRole.SELLER) && user.activeRole !== UserRole.BUYER) {
      toast.info(t('products.switchToBuyer'));
      startTransition(() => {
        switchRole(UserRole.BUYER);
      });
    }
    if (!product) return;
    try {
      await submitPurchaseRequest(product.id, quantity, { [method]: user.email }, proposedPrice);
      toast.success(t('products.purchaseRequestSent', { name: product.name, quantity }));
    } catch (err) {
      toast.error(t('products.purchaseRequestFailed'));
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (product && value >= product.minPurchaseQuantity && value <= product.maxPurchaseQuantity) {
      startTransition(() => {
        setQuantity(value);
      });
    }
  };

  const changeImage = (direction: 'next' | 'prev') => {
    if (!product || !product.images || product.images.length <= 1) {
      return;
    }
    startTransition(() => {
      setCurrentImageIndex((prev) => {
        const imagesLength = product.images!.length; // Non-null assertion after check
        return direction === 'next'
          ? (prev + 1) % imagesLength
          : (prev - 1 + imagesLength) % imagesLength;
      });
    });
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0 : 0.8, ease: 'easeOut' },
    },
  };

  if (!product) {
    return (
      <Container className={styles.productDetailPage}>
        <Typography variant="h4">{t('product.notFound')}</Typography>
      </Container>
    );
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <Container className={styles.productDetailPage}>
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.8, ease: 'easeOut' }}
      >
        <Breadcrumbs
          separator={<NavigateNext />}
          aria-label={t('product.breadcrumbAria')}
          className={styles.breadcrumbs}
        >
          <RouterLink to="/" className={styles.breadcrumbLink}>
            {t('product.home')}
          </RouterLink>
          <RouterLink to="/products" className={styles.breadcrumbLink}>
            {t('product.products')}
          </RouterLink>
          <Typography>{product.name}</Typography>
        </Breadcrumbs>
        <Box className={styles.contentContainer}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box className={styles.imageContainer}>
                <img
                  src={
                    product.images && product.images.length > 0
                      ? product.images[currentImageIndex]
                      : product.image
                  }
                  alt={product.name}
                  className={styles.mainImage}
                  style={{
                    background:
                      imageLoaded === false
                        ? 'linear-gradient(to right, var(--primary-color), var(--accent-color))'
                        : undefined,
                  }}
                  loading="lazy"
                />
                {imageLoaded === false && (
                  <Typography className={styles.imageError}>
                    {t('product.imageError')}
                  </Typography>
                )}
                {product.images && product.images.length > 1 && (
                  <Box className={styles.imageControls}>
                    <IconButton
                      onClick={() => changeImage('prev')}
                      aria-label={t('product.prevImage')}
                    >
                      <ArrowBackIos />
                    </IconButton>
                    <IconButton
                      onClick={() => changeImage('next')}
                      aria-label={t('product.nextImage')}
                    >
                      <ArrowForwardIos />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" className={styles.title}>
                {product.name}
              </Typography>
              <Typography variant="subtitle1" className={styles.seller}>
                {t('product.seller')}: {seller?.businessName || t('product.unknownSeller')}
              </Typography>
              <Typography variant="body1" className={styles.description}>
                {product.description || t('product.noDescription')}
              </Typography>
              <Typography variant="h6" className={styles.price}>
                {product.price}
                {product.bulkPricing && product.bulkPricing.length > 0 && (
                  <Typography variant="caption" component="span">
                    {` (${t('product.bulkPrice', { price: product.bulkPricing[0].price })})`}
                  </Typography>
                )}
              </Typography>
              {product.rating && (
                <Box className={styles.ratingContainer}>
                  <Rating
                    value={product.rating}
                    readOnly
                    precision={0.5}
                    aria-label={t('product.ratingAria', { rating: product.rating })}
                  />
                  <Typography variant="caption">
                    ({product.reviewCount} {t('product.reviews')})
                  </Typography>
                </Box>
              )}
              <Typography variant="body2" className={styles.stock}>
                {product.stockQuantity && product.stockQuantity > 0
                  ? t('product.inStock', { count: product.stockQuantity })
                  : t('product.outOfStock')}
              </Typography>
              {product.isNew && (
                <Chip label={t('product.new')} color="success" className={styles.chip} />
              )}
              {product.isOnSale && (
                <Chip label={t('product.onSale')} color="error" className={styles.chip} />
              )}
              {product.condition && (
                <Chip
                  label={t(`product.condition.${product.condition}`)}
                  className={styles.chip}
                />
              )}
              <Box className={styles.details}>
                {product.sku && (
                  <Typography variant="body2">
                    {t('product.sku')}: {product.sku}
                  </Typography>
                )}
                {product.brand && (
                  <Typography variant="body2">
                    {t('product.brand')}: {product.brand}
                  </Typography>
                )}
                {product.material && (
                  <Typography variant="body2">
                    {t('product.material')}: {product.material}
                  </Typography>
                )}
                {product.warranty && (
                  <Typography variant="body2">
                    {t('product.warranty')}: {product.warranty}
                  </Typography>
                )}
                {product.returnPolicy && (
                  <Typography variant="body2">
                    {t('product.returnPolicy')}: {product.returnPolicy}
                  </Typography>
                )}
              </Box>
              {product.variants && product.variants.length > 0 && (
                <FormControl fullWidth className={styles.variantSelector}>
                  <InputLabel>{t('product.variants')}</InputLabel>
                  <Select
                    value={selectedVariant || ''}
                    onChange={(e) => startTransition(() => setSelectedVariant(e.target.value))}
                    label={t('product.variants')}
                  >
                    {product.variants.map((variant) => (
                      <MenuItem key={variant.sku} value={variant.sku}>
                        {variant.color || variant.size || t('product.unknownVariant')}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              <TextField
                label={t('product.quantity')}
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                InputProps={{
                  inputProps: {
                    min: product.minPurchaseQuantity,
                    max: product.maxPurchaseQuantity,
                  },
                }}
                fullWidth
                className={styles.quantityInput}
                aria-label={t('product.quantityAria', { name: product.name })}
              />
              <TextField
                label={t('product.proposedPrice')}
                value={proposedPrice || ''}
                onChange={(e) => startTransition(() => setProposedPrice(e.target.value))}
                fullWidth
                className={styles.proposedPriceInput}
                aria-label={t('product.proposedPriceAria', { name: product.name })}
              />
              <Box className={styles.buttonContainer}>
                <Button
                  variant="contained"
                  onClick={() => handlePurchaseRequest('email')}
                  disabled={product.stockQuantity === 0}
                  aria-label={t('product.contactEmailAria', { name: product.name, quantity })}
                >
                  {t('product.contactEmail')}
                </Button>
                {seller?.whatsappNumber && (
                  <Button
                    variant="outlined"
                    onClick={() => handlePurchaseRequest('whatsapp')}
                    disabled={product.stockQuantity === 0}
                    aria-label={t('product.contactWhatsAppAria', { name: product.name, quantity })}
                  >
                    {t('product.contactWhatsApp')}
                  </Button>
                )}
                {seller?.telegramUsername && (
                  <Button
                    variant="outlined"
                    onClick={() => handlePurchaseRequest('telegram')}
                    disabled={product.stockQuantity === 0}
                    aria-label={t('product.contactTelegramAria', { name: product.name, quantity })}
                  >
                    {t('product.contactTelegram')}
                  </Button>
                )}
                <Button
                  variant="outlined"
                  onClick={() => startTransition(() => toggleWishlist(product.id))}
                  aria-label={
                    isInWishlist(product.id)
                      ? t('product.removeFromWishlist')
                      : t('product.addedToWishlist')
                  }
                >
                  {isInWishlist(product.id)
                    ? t('product.removeFromWishlist')
                    : t('product.addedToWishlist')}
                </Button>
              </Box>
            </Grid>
          </Grid>
          {relatedProducts.length > 0 && (
            <Box className={styles.relatedProducts}>
              <Typography variant="h5">{t('product.relatedProducts')}</Typography>
              <Grid container spacing={3}>
                {relatedProducts.map((related) => (
                  <Grid item xs={12} sm={6} md={4} key={related.id}>
                    <motion.div
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <ProductCard
                        product={related}
                        cardVariants={cardVariants}
                        handlePurchaseRequest={(productId, productName, qty) =>
                          handlePurchaseRequest('email')
                        }
                        sellerName={sellers.find((s) => s.id === related.sellerId)?.businessName}
                      />
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      </motion.div>
    </Container>
  );
};

export default ProductDetailPage;