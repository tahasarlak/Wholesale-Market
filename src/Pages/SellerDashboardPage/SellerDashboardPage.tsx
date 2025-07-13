import React, { useContext } from 'react';
import { Container, Typography, Box, Button, List, ListItem, ListItemText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { AuthContext, AuthContextType, UserRole } from '../../context/AuthContext';
import { ProductContext, ProductContextType } from '../../context/ProductContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import styles from './SellerDashboardPage.module.css';

const SellerDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useContext(AuthContext) as AuthContextType;
  const { products, purchaseRequests } = useContext(ProductContext) as ProductContextType;
  const navigate = useNavigate();

  if (!isAuthenticated || !user || !user.roles.includes(UserRole.SELLER)) {
    toast.error(t('products.sellerRoleRequired'));
    navigate('/login');
    return null;
  }

  if (user.sellerInfo?.verificationStatus !== 'verified') {
    toast.error(t('products.sellerNotVerified'));
    navigate('/profile');
    return null;
  }

  const sellerProducts = products.filter((p) => p.sellerId === user.id);
  const sellerRequests = purchaseRequests.filter((pr) => pr.sellerId === user.id);

  return (
    <Container className={styles.sellerDashboardPage}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <Typography variant="h3" className={styles.title}>
          {t('sellerDashboard.title')}
        </Typography>
        <Box className={styles.contentContainer}>
          <Typography variant="h5">{t('sellerDashboard.products')}</Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/add-product')}
            className={styles.addButton}
            aria-label={t('products.addProduct')}
          >
            {t('products.addProduct')}
          </Button>
          <List>
            {sellerProducts.length === 0 ? (
              <Typography>{t('sellerDashboard.noProducts')}</Typography>
            ) : (
              sellerProducts.map((product) => (
                <ListItem key={product.id}>
                  <ListItemText
                    primary={product.name}
                    secondary={`${t('product.price')}: ${product.price}, ${t('product.stockQuantity')}: ${product.stockQuantity}`}
                  />
                </ListItem>
              ))
            )}
          </List>
          <Typography variant="h5">{t('sellerDashboard.purchaseRequests')}</Typography>
          <List>
            {sellerRequests.length === 0 ? (
              <Typography>{t('sellerDashboard.noRequests')}</Typography>
            ) : (
              sellerRequests.map((request) => (
                <ListItem key={request.id}>
                  <ListItemText
                    primary={`${t('product.quantity')}: ${request.quantity}`}
                    secondary={`${t('product.status')}: ${request.status}, ${t('product.proposedPrice')}: ${request.proposedPrice || 'N/A'}`}
                  />
                </ListItem>
              ))
            )}
          </List>
        </Box>
      </motion.div>
    </Container>
  );
};

export default SellerDashboardPage;