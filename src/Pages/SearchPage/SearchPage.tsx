import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Box, TextField, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import { ProductContext } from '../../context/ProductContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import styles from './SearchPage.module.css';

const SearchPage: React.FC = () => {
  const { t } = useTranslation();
  const { products, addToCart } = useContext(ProductContext);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          {filteredProducts.map((product) => (
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
                    onClick={() => addToCart(product.id, 1)}
                    className={styles.addToCartButton}
                    aria-label={t('products.addToCartAria', { name: product.name })}
                  >
                    {t('products.addToCart')}
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