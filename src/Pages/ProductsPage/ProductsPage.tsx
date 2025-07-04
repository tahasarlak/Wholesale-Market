import React, { useState, useEffect, useContext, useMemo, Suspense, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  TextField,
  CircularProgress,
  Breadcrumbs,
  Link as MuiLink,
  InputAdornment,
  Slider,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { motion, useReducedMotion, Variants } from 'framer-motion';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ProductContext, ProductContextType } from '../../context/ProductContext';
import { ThemeContext, ThemeContextType } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import styles from './ProductsPage.module.css';
import debounce from 'lodash/debounce';
import { startTransition } from 'react';

const ProductCard = React.lazy(() => import('../../components/ProductCard/ProductCard'));
const ErrorBoundary = React.lazy(() => import('../../components/ErrorBoundary/ErrorBoundary'));

const categories = ['All', 'Electronics', 'Clothing', 'Furniture', 'Books', 'Accessories'] as const;
const sortOptions = [
  { value: 'default', label: 'products.sortOptions.default' },
  { value: 'price-asc', label: 'products.sortOptions.price-asc' },
  { value: 'price-desc', label: 'products.sortOptions.price-desc' },
  { value: 'rating-desc', label: 'products.sortOptions.rating-desc' },
  { value: 'name-asc', label: 'products.sortOptions.name-asc' },
] as const;

const ITEMS_PER_PAGE = 12;
const MAX_PRICE = 5000;
const DEBOUNCE_DELAY = 300;

interface PriceRange {
  min: number;
  max: number;
}

const ProductsPage: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const productContext = useContext(ProductContext);
  const { isDarkMode } = useContext(ThemeContext) as ThemeContextType;
  const shouldReduceMotion = useReducedMotion();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortOption, setSortOption] = useState<string>('default');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceRange, setPriceRange] = useState<PriceRange>({ min: 0, max: MAX_PRICE });
  const [minRating, setMinRating] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!productContext) {
    throw new Error(t('products.error.noProductContext'));
  }

  const { products, addToCart } = productContext;

  // Animation variants for section and cards
  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.8,
        ease: 'easeOut' as const,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20, scale: shouldReduceMotion ? 1 : 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.5,
        ease: 'easeOut' as const,
        staggerChildren: 0.1,
      },
    },
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      startTransition(() => {
        navigate(`?q=${encodeURIComponent(value)}&category=${selectedCategory}`);
      });
    }, DEBOUNCE_DELAY),
    [selectedCategory, navigate]
  );

  useEffect(() => {
    startTransition(() => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams(location.search);
        const query = params.get('q') || '';
        const category = params.get('category') || 'All';
        setSearchQuery(query);
        setSelectedCategory(category);
        setCurrentPage(1);
      } catch (error) {
        console.error('Error parsing URL params:', error);
        toast.error(t('products.error.urlParams'));
      } finally {
        setIsLoading(false);
      }
    });
  }, [location.search, t]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products
      .filter((product) => {
        if (!product) return false;

        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase());
        const price = parseFloat(product.price?.replace('$', '') || '0');
        const matchesPrice = price >= priceRange.min && price <= priceRange.max;
        const matchesRating = (product.rating || 0) >= minRating;

        return matchesCategory && matchesSearch && matchesPrice && matchesRating;
      })
      .sort((a, b) => {
        const priceA = parseFloat(a.price?.replace('$', '') || '0');
        const priceB = parseFloat(b.price?.replace('$', '') || '0');

        switch (sortOption) {
          case 'price-asc':
            return priceA - priceB;
          case 'price-desc':
            return priceB - priceA;
          case 'rating-desc':
            return (b.rating || 0) - (a.rating || 0);
          case 'name-asc':
            return a.name?.localeCompare(b.name || '') || 0;
          default:
            return 0;
        }
      });
  }, [products, selectedCategory, searchQuery, sortOption, priceRange, minRating]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, page: number) => {
    startTransition(() => {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }, []);

  const handleAddToCart = useCallback(
    (productId: number, productName: string) => {
      try {
        addToCart(productId, 1);
        toast.success(t('products.addedToCart', { name: productName }));
      } catch (error) {
        console.error('Error adding to cart:', error);
        toast.error(t('products.error.addToCart'));
      }
    },
    [addToCart, t]
  );

  const handlePriceRangeChange = useCallback(
    (event: Event, newValue: number | number[]) => {
      startTransition(() => {
        if (Array.isArray(newValue)) {
          setPriceRange({ min: newValue[0], max: newValue[1] });
          setCurrentPage(1);
        }
      });
    },
    []
  );

  const handleCategoryChange = useCallback(
    (value: string) => {
      startTransition(() => {
        setSelectedCategory(value);
        setCurrentPage(1);
        navigate(`?q=${encodeURIComponent(searchQuery)}&category=${value}`);
      });
    },
    [navigate, searchQuery]
  );

  const handleSortChange = useCallback(
    (value: string) => {
      startTransition(() => {
        setSortOption(value);
        setCurrentPage(1);
      });
    },
    []
  );

  const handleRatingChange = useCallback(
    (value: string) => {
      startTransition(() => {
        setMinRating(parseInt(value));
        setCurrentPage(1);
      });
    },
    []
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      startTransition(() => {
        setSearchQuery(value);
        debouncedSearch(value);
      });
    },
    [debouncedSearch]
  );

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: t('products.title'),
    description: t('products.description'),
    url: window.location.href,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: t('products.home'), item: window.location.origin },
        { '@type': 'ListItem', position: 2, name: t('products.title') },
      ],
    },
    offers: filteredProducts.map((product) => ({
      '@type': 'Offer',
      price: parseFloat(product.price?.replace('$', '') || '0'),
      priceCurrency: 'USD',
      itemOffered: {
        '@type': 'Product',
        name: product.name,
        category: product.category,
      },
    })),
  };

  return (
    <motion.section
      className={`${styles.productsPage} ${isDarkMode ? styles.dark : styles.light}`}
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      role="main"
      aria-label={t('products.ariaLabel')}
    >
      <Container maxWidth="xl" className={styles.container}>
        <Helmet>
          <title>{t('products.title')}</title>
          <meta name="description" content={t('products.description')} />
          <meta name="keywords" content={t('products.keywords')} />
          <link rel="canonical" href={window.location.href} />
          <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        </Helmet>

        <Breadcrumbs
          aria-label={t('products.breadcrumbAria')}
          className={styles.breadcrumbs}
          separator="›"
        >
          <MuiLink component={RouterLink} to="/" className={styles.breadcrumbLink}>
            {t('products.home')}
          </MuiLink>
          <Typography className={styles.breadcrumbCurrent}>{t('products.title')}</Typography>
        </Breadcrumbs>

        <Typography variant="h3" component="h1" className={styles.title}>
          {t('products.title')}
        </Typography>
        <Typography variant="h6" className={styles.description}>
          {t('products.description')}
        </Typography>

        <Box className={styles.filterContainer}>
          <TextField
            label={t('products.search')}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className={styles.searchInput}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            aria-label={t('products.searchAria')}
          />

          <FormControl className={styles.formControl} variant="outlined">
            <InputLabel id="category-label">{t('products.category')}</InputLabel>
            <Select
              labelId="category-label"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value as string)}
              label={t('products.category')}
              className={styles.select}
              aria-describedby="category-select"
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {t(`products.categories.${category.toLowerCase()}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl className={styles.formControl} variant="outlined">
            <InputLabel id="sort-label">{t('products.sortBy')}</InputLabel>
            <Select
              labelId="sort-label"
              value={sortOption}
              onChange={(e) => handleSortChange(e.target.value as string)}
              label={t('products.sortBy')}
              className={styles.select}
              aria-describedby="sort-select"
            >
              {sortOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {t(option.label)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box className={styles.priceRangeContainer}>
            <Typography id="price-range-slider" className={styles.sliderLabel}>
              {t('products.priceRange')}
            </Typography>
            <Slider
              value={[priceRange.min, priceRange.max]}
              onChange={handlePriceRangeChange}
              valueLabelDisplay="auto"
              min={0}
              max={MAX_PRICE}
              step={10}
              aria-labelledby="price-range-slider"
              className={styles.priceSlider}
            />
            <Box className={styles.priceRangeValues}>
              <Typography className={styles.priceValue}>${priceRange.min}</Typography>
              <Typography className={styles.priceValue}>${priceRange.max}</Typography>
            </Box>
          </Box>

          <FormControl className={styles.formControl} variant="outlined">
            <InputLabel id="rating-label">{t('products.minRating')}</InputLabel>
            <Select
              labelId="rating-label"
              value={minRating.toString()}
              onChange={(e) => handleRatingChange(e.target.value as string)}
              label={t('products.minRating')}
              className={styles.select}
              aria-describedby="rating-select"
            >
              {[0, 1, 2, 3, 4, 5].map((rating) => (
                <MenuItem key={rating} value={rating}>
                  {rating} {t('products.stars')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <ErrorBoundary>
          <Suspense fallback={<CircularProgress className={styles.loadingSpinner} aria-label={t('products.loading')} />}>
            {isLoading ? (
              <Box className={styles.loadingContainer}>
                <CircularProgress className={styles.loadingSpinner} aria-label={t('products.loading')} />
              </Box>
            ) : paginatedProducts.length === 0 ? (
              <Typography variant="h6" className={styles.noProductsMessage}>
                {t('products.noProducts')}
              </Typography>
            ) : (
              <motion.div className={styles.productGrid} variants={cardVariants} initial="hidden" animate="visible">
                {paginatedProducts.map((product) => (
                  <motion.div key={product.id} className={styles.productContainer} variants={cardVariants}>
                    <ProductCard
                      product={product}
                      cardVariants={cardVariants}
                      handleAddToCart={handleAddToCart}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </Suspense>
        </ErrorBoundary>

        {totalPages > 1 && (
          <Box className={styles.paginationContainer}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
              className={styles.pagination}
              aria-label={t('products.pagination')}
            />
          </Box>
        )}
      </Container>
    </motion.section>
  );
};

export default ProductsPage;