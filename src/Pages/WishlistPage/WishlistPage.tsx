import React, { useContext } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { AuthContext, AuthContextType } from '../../context/AuthContext';
import { ProductContext, ProductContextType } from '../../context/ProductContext';
import { WishlistContext, WishlistContextType } from '../../context/WishlistContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import styles from './WishlistPage.module.css';

const WishlistPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useContext(AuthContext) as AuthContextType;
  const { products } = useContext(ProductContext) as ProductContextType;
  const { wishlist, toggleWishlist } = useContext(WishlistContext) as WishlistContextType;
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    toast.error(t('products.pleaseLogin'));
    navigate('/login');
    return null;
  }

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <Container className={styles.wishlistPage}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <Typography variant="h3" className={styles.title}>
          {t('wishlist.title')}
        </Typography>
        <Box className={styles.contentContainer}>
          <List>
            {wishlistProducts.length === 0 ? (
              <Typography>{t('wishlist.noItems')}</Typography>
            ) : (
              wishlistProducts.map((product) => (
                <ListItem key={product.id}>
                  <ListItemText
                    primary={product.name}
                    secondary={`${t('product.price')}: ${product.price}`}
                  />
                  <Button
                    variant="outlined"
                    onClick={() => toggleWishlist(product.id)}
                    aria-label={t('product.removeFromWishlist')}
                  >
                    {t('product.removeFromWishlist')}
                  </Button>
                </ListItem>
              ))
            )}
          </List>
        </Box>
      </motion.div>
    </Container>
  );
};

export default WishlistPage;