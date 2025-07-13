import React, { useContext } from 'react';
import { Container, Typography, Box, Button, List, ListItem, ListItemText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { AuthContext, AuthContextType, UserRole } from '../../context/AuthContext';
import { ProductContext, ProductContextType } from '../../context/ProductContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import styles from './AdminPanelPage.module.css';

const AdminPanelPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, approveSeller } = useContext(AuthContext) as AuthContextType;
  const { sellers, purchaseRequests } = useContext(ProductContext) as ProductContextType;
  const navigate = useNavigate();

  if (!isAuthenticated || !user || !user.roles.includes(UserRole.ADMIN)) {
    toast.error(t('adminPanel.adminRoleRequired'));
    navigate('/login');
    return null;
  }

  const pendingSellers = sellers.filter((s) => s.verificationStatus === 'pending');

  const handleApproveSeller = async (sellerId: number) => {
    try {
      await approveSeller(sellerId);
      toast.success(t('adminPanel.sellerApproved'));
    } catch (error) {
      toast.error(t('adminPanel.sellerApprovalFailed'));
    }
  };

  return (
    <Container className={styles.adminPanelPage}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <Typography variant="h3" className={styles.title}>
          {t('adminPanel.title')}
        </Typography>
        <Box className={styles.contentContainer}>
          <Typography variant="h5">{t('adminPanel.pendingSellers')}</Typography>
          <List>
            {pendingSellers.length === 0 ? (
              <Typography>{t('adminPanel.noPendingSellers')}</Typography>
            ) : (
              pendingSellers.map((seller) => (
                <ListItem key={seller.id}>
                  <ListItemText
                    primary={seller.businessName}
                    secondary={`${t('login.email')}: ${seller.email}`}
                  />
                  <Button
                    variant="contained"
                    onClick={() => handleApproveSeller(seller.id)}
                    aria-label={t('adminPanel.approveSeller', { name: seller.businessName })}
                  >
                    {t('adminPanel.approve')}
                  </Button>
                </ListItem>
              ))
            )}
          </List>
          <Typography variant="h5">{t('adminPanel.purchaseRequests')}</Typography>
          <List>
            {purchaseRequests.length === 0 ? (
              <Typography>{t('adminPanel.noRequests')}</Typography>
            ) : (
              purchaseRequests.map((request) => (
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

export default AdminPanelPage;