import React, { useContext } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { AuthContext, AuthContextType } from '../../context/AuthContext';
import { ProductContext, ProductContextType } from '../../context/ProductContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import styles from './PurchaseRequestsPage.module.css';

const PurchaseRequestsPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useContext(AuthContext) as AuthContextType;
  const { purchaseRequests, products } = useContext(ProductContext) as ProductContextType;
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    toast.error(t('products.pleaseLogin'));
    navigate('/login');
    return null;
  }

  const userRequests = purchaseRequests.filter((pr) => pr.buyerId === user.id);

  return (
    <Container className={styles.purchaseRequestsPage}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <Typography variant="h3" className={styles.title}>
          {t('purchaseRequests.title')}
        </Typography>
        <Box className={styles.contentContainer}>
          <List>
            {userRequests.length === 0 ? (
              <Typography>{t('purchaseRequests.noRequests')}</Typography>
            ) : (
              userRequests.map((request) => {
                const product = products.find((p) => p.id === request.productId);
                return (
                  <ListItem key={request.id}>
                    <ListItemText
                      primary={product ? product.name : t('product.unknownProduct')}
                      secondary={`${t('product.quantity')}: ${request.quantity}, ${t('product.status')}: ${request.status}, ${t('product.proposedPrice')}: ${request.proposedPrice || 'N/A'}`}
                    />
                  </ListItem>
                );
              })
            )}
          </List>
        </Box>
      </motion.div>
    </Container>
  );
};

export default PurchaseRequestsPage;