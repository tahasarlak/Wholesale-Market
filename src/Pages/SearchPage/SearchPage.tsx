import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Box, TextField, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import { ProductContext, ProductContextType, Product } from '../../context/ProductContext';
import { AuthContext, AuthContextType, UserRole } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './SearchPage.module.css';

const SearchPage: React.FC = () => {
  const { t } = useTranslation();
  const { products, submitPurchaseRequest } = useContext(ProductContext) as ProductContextType;
  const { user, switchRole } = useContext(AuthContext) as AuthContextType;
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredProducts = products.filter((product: Product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePurchaseRequest = async (
    productId: number,
    productName: string,
    quantity: number = 1,
    proposedPrice?: string
  ) => {
    if (!user) {
      toast.error(t('products.pleaseLogin'));
      navigate('/login');
      return;
    }
    if (user.roles.includes(UserRole.SELLER) && user.activeRole !== UserRole.BUYER) {
      toast.info(t('products.switchToBuyer'));
      switchRole(UserRole.BUYER);
    }
    try {
      await submitPurchaseRequest(productId, quantity, { email: user.email }, proposedPrice);
      toast.success(t('products.purchaseRequestSent', { name: productName, quantity }));
    } catch (err) {
      toast.error(t('products.purchaseRequestFailed'));
    }
  };

  return (
    <Box className={styles.searchPage}>
      <Helmet>
        <title>{t('search.title')}</title>
        <meta name="description" content={t('search.description')} />
      </Helmet>
      <Typography variant="h4" className={styles.title}>
        {t('search.title')}
      </Typography>
      <TextField
        label={t('search.placeholder')}
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />
      {filteredProducts.length === 0 ? (
        <Typography className={styles.noProductsMessage}>{t('products.noProducts')}</Typography>
      ) : (
        <List>
          {filteredProducts.map((product: Product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ListItem
                className={styles.listItem}
                secondaryAction={
                  <Button
                    variant="contained"
                    onClick={() => handlePurchaseRequest(product.id, product.name)}
                    className={styles.addToCartButton}
                    aria-label={t('products.purchaseRequestAria', { name: product.name })}
                  >
                    {t('product.purchaseRequest')}
                  </Button>
                }
              >
                <ListItemText
                  primary={product.name}
                  secondary={t('products.itemDetails', {
                    price: product.price,
                    rating: product.rating,
                  })}
                  onClick={() => navigate(`/products/${product.id}`)}
                  className={styles.listItemText}
                />
              </ListItem>
            </motion.div>
          ))}
        </List>
      )}
    </Box>
  );
};

export default SearchPage;