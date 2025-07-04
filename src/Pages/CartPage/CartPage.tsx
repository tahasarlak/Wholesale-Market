import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Box, Typography, List, ListItem, ListItemText, IconButton, Button } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { ProductContext } from '../../context/ProductContext';
import { motion } from 'framer-motion';
import styles from './CartPage.module.css';

const CartPage: React.FC = () => {
  const { t } = useTranslation();
  const { cartItems, products, removeFromCart, addToCart } = useContext(ProductContext);

  return (
    <Box className={styles.cartPage}>
      <Helmet>
        <title>{t('cart.title')}</title>
        <meta name="description" content={t('cart.description')} />
      </Helmet>
      <Typography variant="h4" className={styles.title}>
        {t('cart.title')}
      </Typography>
      {cartItems.length === 0 ? (
        <Typography className={styles.emptyMessage}>{t('cart.empty')}</Typography>
      ) : (
        <List>
          {cartItems.map((item) => {
            const product = products.find((p) => p.id === item.productId);
            return (
              <motion.div
                key={item.productId}
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
                      onClick={() => removeFromCart(item.productId)}
                    >
                      <Delete />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={product?.name || t('products.unknownProduct')}
                    secondary={t('cart.itemDetails', {
                      quantity: item.quantity,
                      price: product?.price || 0,
                      total: (product?.price ? parseFloat(product.price.replace('$', '')) : 0) * item.quantity,
                    })}
                  />
                  <Button
                    onClick={() => addToCart(item.productId, 1)}
                    aria-label={t('cart.addMoreAria', { name: product?.name || 'Product' })}
                  >
                    {t('cart.addMore')}
                  </Button>
                </ListItem>
              </motion.div>
            );
          })}
        </List>
      )}
      <Button
        variant="contained"
        disabled={cartItems.length === 0}
        className={styles.checkoutButton}
        onClick={() => alert(t('cart.checkout'))}
      >
        {t('cart.checkout')}
      </Button>
    </Box>
  );
};

export default CartPage;