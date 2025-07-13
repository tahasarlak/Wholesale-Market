import React, { useContext, useState } from 'react';
import { Container, Typography, Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { AuthContext, AuthContextType, UserRole } from '../../context/AuthContext';
import { ProductContext, ProductContextType, Product } from '../../context/ProductContext';
import { toast } from 'react-toastify';
import styles from './AddProductPage.module.css';

const AddProductPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useContext(AuthContext) as AuthContextType;
  const { products } = useContext(ProductContext) as ProductContextType;
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    image: '',
    category: '',
    stockQuantity: 1,
    minPurchaseQuantity: 1,
    maxPurchaseQuantity: 100,
    sku: '',
    brand: '',
    material: '',
    warranty: '',
    condition: 'new' as 'new' | 'used' | 'refurbished',
    returnPolicy: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name as string]: value }));
  };

  const handleSubmit = async () => {
    if (!isAuthenticated || !user) {
      toast.error(t('products.pleaseLogin'));
      return;
    }
    if (!user.roles.includes(UserRole.SELLER) || user.sellerInfo?.verificationStatus !== 'verified') {
      toast.error(t('products.sellerNotVerified'));
      return;
    }
    try {
      const newProduct: Product = {
        id: products.length + 1,
        sellerId: user.id,
        ...productData,
        price: `$${parseFloat(productData.price).toFixed(2)}`,
        stockQuantity: parseInt(productData.stockQuantity.toString()),
        minPurchaseQuantity: parseInt(productData.minPurchaseQuantity.toString()),
        maxPurchaseQuantity: parseInt(productData.maxPurchaseQuantity.toString()),
      };
      // Simulate API call to add product
      console.log('Adding product:', newProduct);
      toast.success(t('products.productAdded'));
    } catch (error) {
      toast.error(t('products.productAddFailed'));
    }
  };

  return (
    <Container className={styles.addProductPage}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <Typography variant="h3" className={styles.title}>
          {t('products.addProduct')}
        </Typography>
        <Box className={styles.contentContainer}>
          <TextField
            label={t('product.name')}
            name="name"
            value={productData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label={t('product.description')}
            name="description"
            value={productData.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
          <TextField
            label={t('product.shortDescription')}
            name="shortDescription"
            value={productData.shortDescription}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label={t('product.price')}
            name="price"
            type="number"
            value={productData.price}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label={t('product.image')}
            name="image"
            value={productData.image}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>{t('product.category')}</InputLabel>
            <Select
              name="category"
              value={productData.category}
              onChange={handleChange}
              label={t('product.category')}
            >
              <MenuItem value="Electronics">{t('products.categories.electronics')}</MenuItem>
              <MenuItem value="Clothing">{t('products.categories.clothing')}</MenuItem>
              <MenuItem value="Furniture">{t('products.categories.furniture')}</MenuItem>
              <MenuItem value="Books">{t('products.categories.books')}</MenuItem>
              <MenuItem value="Accessories">{t('products.categories.accessories')}</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label={t('product.stockQuantity')}
            name="stockQuantity"
            type="number"
            value={productData.stockQuantity}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label={t('product.minPurchaseQuantity')}
            name="minPurchaseQuantity"
            type="number"
            value={productData.minPurchaseQuantity}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label={t('product.maxPurchaseQuantity')}
            name="maxPurchaseQuantity"
            type="number"
            value={productData.maxPurchaseQuantity}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label={t('product.sku')}
            name="sku"
            value={productData.sku}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label={t('product.brand')}
            name="brand"
            value={productData.brand}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label={t('product.material')}
            name="material"
            value={productData.material}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label={t('product.warranty')}
            name="warranty"
            value={productData.warranty}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>{t('product.condition')}</InputLabel>
            <Select
              name="condition"
              value={productData.condition}
              onChange={handleChange}
              label={t('product.condition')}
            >
              <MenuItem value="new">{t('product.condition.new')}</MenuItem>
              <MenuItem value="used">{t('product.condition.used')}</MenuItem>
              <MenuItem value="refurbished">{t('product.condition.refurbished')}</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label={t('product.returnPolicy')}
            name="returnPolicy"
            value={productData.returnPolicy}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            onClick={handleSubmit}
            className={styles.submitButton}
            aria-label={t('products.addProduct')}
          >
            {t('products.addProduct')}
          </Button>
        </Box>
      </motion.div>
    </Container>
  );
};

export default AddProductPage;