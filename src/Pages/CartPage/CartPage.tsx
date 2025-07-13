import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Box, Typography, List, ListItem, ListItemText, IconButton, Button } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { ProductContext, ProductContextType, PurchaseRequest, Product } from '../../context/ProductContext';
import { motion } from 'framer-motion';
import styles from './CartPage.module.css';

const CartPage: React.FC = () => {
  const { t } = useTranslation();
  const { purchaseRequests, products } = useContext(ProductContext) as ProductContextType;

  const handleRemoveRequest = (requestId: number) => {
    // Simulate removing a purchase request (in a real app, this would update the backend)
    console.log(`Removing purchase request with ID: ${requestId}`);
  };

  return (
    <Box className={styles.cartPage}>
      <Helmet>
        <title>{t('purchaseRequests.title')}</title>
        <meta name="description" content={t('purchaseRequests.description')} />
      </Helmet>
      <Typography variant="h4" className={styles.title}>
        {t('purchaseRequests.title')}
      </Typography>
      {purchaseRequests.length === 0 ? (
        <Typography className={styles.emptyMessage}>{t('purchaseRequests.noRequests')}</Typography>
      ) : (
        <List>
          {purchaseRequests.map((request: PurchaseRequest) => {
            const product: Product | undefined = products.find((p: Product) => p.id === request.productId);
            return (
              <motion.div
                key={request.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ListItem
                  className={styles.listItem}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label={t('cart.removeAria', { name: product?.name || 'Product' })}
                      onClick={() => handleRemoveRequest(request.id)}
                    >
                      <Delete />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={product?.name || t('products.unknownProduct')}
                    secondary={t('cart.itemDetails', {
                      quantity: request.quantity,
                      price: product?.price || 0,
                      total: product?.price
                        ? (parseFloat(product.price.replace('$', '')) * request.quantity).toFixed(2)
                        : 0,
                    })}
                  />
                </ListItem>
              </motion.div>
            );
          })}
        </List>
      )}
      <Button
        variant="contained"
        disabled={purchaseRequests.length === 0}
        className={styles.checkoutButton}
        onClick={() => alert(t('cart.checkout'))}
      >
        {t('cart.checkout')}
      </Button>
    </Box>
  );
};

export default CartPage;