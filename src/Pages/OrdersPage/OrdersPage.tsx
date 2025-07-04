import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Box, Button, CircularProgress } from '@mui/material';
import { motion, Variants } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AuthContext, AuthContextType } from '../../context/AuthContext';
import { ThemeContext, ThemeContextType } from '../../context/ThemeContext';
import { ProductContext, ProductContextType } from '../../context/ProductContext';
import { toast } from 'react-toastify';
import styles from './OrdersPage.module.css';

interface Order {
  id: number;
  date: string;
  total: string;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: { productId: number; quantity: number }[];
}

const OrdersPage: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useContext(AuthContext) as AuthContextType;
  const { isDarkMode } = useContext(ThemeContext) as ThemeContextType;
  const { products } = useContext(ProductContext) as ProductContextType;
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isAuthenticated) {
      const mockOrders: Order[] = [
        {
          id: 1,
          date: '2025-06-15',
          total: '$599.98',
          status: 'Delivered',
          items: [
            { productId: 1, quantity: 1 },
            { productId: 4, quantity: 1 },
          ],
        },
        {
          id: 2,
          date: '2025-06-10',
          total: '$89.99',
          status: 'Shipped',
          items: [{ productId: 2, quantity: 1 }],
        },
      ];
      setTimeout(() => {
        setOrders(mockOrders);
        setIsLoading(false);
        toast.success(t('orders.loaded'));
      }, 1000);
    } else {
      setIsLoading(false);
      toast.error(t('orders.pleaseLogin'));
    }
  }, [isAuthenticated, t]);

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: t('orders.title'),
    description: t('orders.description'),
    url: window.location.href,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
        { '@type': 'ListItem', position: 2, name: t('orders.title') },
      ],
    },
  };

  if (!isAuthenticated) {
    return (
      <Container className={`${styles.ordersPage} ${isDarkMode ? styles.ordersPageDark : styles.ordersPageLight}`}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <Typography variant="h3" className={styles.title}>
            {t('orders.title')}
          </Typography>
          <Typography variant="h6" className={styles.description}>
            {t('orders.notAuthenticated')}
          </Typography>
          <Box className={styles.loginContainer}>
            <Button
              component={RouterLink}
              to="/login"
              variant="contained"
              className={styles.loginButton}
              aria-label={t('orders.loginButton')}
            >
              {t('orders.loginButton')}
            </Button>
          </Box>
        </motion.div>
      </Container>
    );
  }

  return (
    <Container className={`${styles.ordersPage} ${isDarkMode ? styles.ordersPageDark : styles.ordersPageLight}`}>
      <Helmet>
        <title>{t('orders.title')}</title>
        <meta name="description" content={t('orders.description')} />
        <link rel="canonical" href={window.location.href} />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        role="main"
        aria-label={t('orders.ariaLabel')}
      >
        <Typography variant="h3" className={styles.title}>
          {t('orders.title')}
        </Typography>
        <Typography variant="h6" className={styles.description}>
          {t('orders.description')}
        </Typography>

        {isLoading ? (
          <Box className={styles.loadingContainer}>
            <CircularProgress aria-label={t('orders.loading')} />
          </Box>
        ) : orders.length === 0 ? (
          <Typography variant="h6" className={styles.description}>
            {t('orders.noOrders')}
          </Typography>
        ) : (
          <div className="flex flex-wrap gap-4 justify-center">
            {orders.map((order) => (
              <div key={order.id} className={styles.orderContainer}>
                <motion.div variants={cardVariants} initial="hidden" animate="visible">
                  <Box className={`${styles.orderCard} ${isDarkMode ? styles.orderCardDark : ''}`}>
                    <Typography variant="h6" className={styles.orderTitle}>
                      {t('orders.order')} #{order.id}
                    </Typography>
                    <Typography className={styles.orderText}>
                      {t('orders.date')}: {order.date}
                    </Typography>
                    <Typography className={styles.orderText}>
                      {t('orders.total')}: {order.total}
                    </Typography>
                    <Typography className={styles.orderText}>
                      {t('orders.status')}: {order.status}
                    </Typography>
                    <Box className={styles.orderItems}>
                      <Typography variant="subtitle1" className={styles.orderItemsTitle}>
                        {t('orders.items')}
                      </Typography>
                      {order.items.map((item) => {
                        const product = products.find((p) => p.id === item.productId);
                        return (
                          <Box key={item.productId} className={styles.orderItem}>
                            <Typography>
                              {product ? product.name : t('orders.unknownProduct')} -{' '}
                              {t('orders.quantity')}: {item.quantity}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                    <Button
                      component={RouterLink}
                      to={`/products/${order.items[0]?.productId}`}
                      variant="outlined"
                      className={styles.viewButton}
                      aria-label={t('orders.viewDetails')}
                    >
                      {t('orders.viewDetails')}
                    </Button>
                  </Box>
                </motion.div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </Container>
  );
};

export default OrdersPage;