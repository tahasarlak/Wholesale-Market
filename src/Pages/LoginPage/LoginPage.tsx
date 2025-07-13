import React, { useContext, useState } from 'react';
import { Container, Typography, Button, Box, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { AuthContext, AuthContextType, UserRole } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import styles from './LoginPage.module.css';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated, login, logout, user, registerSeller } = useContext(AuthContext) as AuthContextType;
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');
  const [sellerInfo, setSellerInfo] = useState({
    businessName: '',
    whatsappNumber: '',
    telegramUsername: '',
    preferredCommunication: 'email' as 'email' | 'whatsapp' | 'telegram',
    paymentMethods: ['Bank Transfer'],
  });

  const handleLogin = async () => {
    if (!email || !password || !selectedRole) {
      toast.error(t('login.fillAllFields'));
      return;
    }
    try {
      await login(email, password, [selectedRole]);
      toast.success(t('login.success'));
    } catch (error) {
      toast.error(t('login.failed'));
    }
  };

  const handleSellerRegistration = async () => {
    if (!email || !sellerInfo.businessName || !sellerInfo.preferredCommunication) {
      toast.error(t('login.fillAllFields'));
      return;
    }
    try {
      await registerSeller({ ...sellerInfo, email, name: email.split('@')[0] });
      toast.success(t('login.sellerRegistrationSubmitted'));
    } catch (error) {
      toast.error(t('login.sellerRegistrationFailed'));
    }
  };

  return (
    <Container className={styles.loginPage}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <Typography variant="h3" className={styles.title}>
          {t('login.title')}
        </Typography>
        <Box className={styles.contentContainer}>
          {isAuthenticated ? (
            <>
              <Typography variant="body1" paragraph>
                {t('login.alreadyLoggedIn', { name: user?.name })}
              </Typography>
              <Typography variant="body2">
                {t('login.currentRole')}: {user?.roles[0]}
              </Typography>
              <Button
                variant="contained"
                onClick={logout}
                className={styles.loginButton}
                aria-label={t('login.logout')}
              >
                {t('login.logout')}
              </Button>
            </>
          ) : (
            <>
              <Typography variant="body1" paragraph>
                {t('login.prompt')}
              </Typography>
              <TextField
                label={t('login.email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin="normal"
                aria-label={t('login.emailAria')}
              />
              <TextField
                label={t('login.password')}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                margin="normal"
                aria-label={t('login.passwordAria')}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="role-label">{t('login.selectRole')}</InputLabel>
                <Select
                  labelId="role-label"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  label={t('login.selectRole')}
                >
                  <MenuItem value={UserRole.BUYER}>{t('login.role.buyer')}</MenuItem>
                  <MenuItem value={UserRole.SELLER}>{t('login.role.seller')}</MenuItem>
                  <MenuItem value={UserRole.ADMIN}>{t('login.role.admin')}</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                onClick={handleLogin}
                className={styles.loginButton}
                aria-label={t('login.login')}
              >
                {t('login.login')}
              </Button>
              {selectedRole === UserRole.SELLER && (
                <Box mt={2}>
                  <Typography variant="h6">{t('login.sellerRegistration')}</Typography>
                  <TextField
                    label={t('login.businessName')}
                    value={sellerInfo.businessName}
                    onChange={(e) => setSellerInfo({ ...sellerInfo, businessName: e.target.value })}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label={t('login.whatsappNumber')}
                    value={sellerInfo.whatsappNumber}
                    onChange={(e) => setSellerInfo({ ...sellerInfo, whatsappNumber: e.target.value })}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label={t('login.telegramUsername')}
                    value={sellerInfo.telegramUsername}
                    onChange={(e) => setSellerInfo({ ...sellerInfo, telegramUsername: e.target.value })}
                    fullWidth
                    margin="normal"
                  />
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="comm-label">{t('login.preferredCommunication')}</InputLabel>
                    <Select
                      labelId="comm-label"
                      value={sellerInfo.preferredCommunication}
                      onChange={(e) =>
                        setSellerInfo({ ...sellerInfo, preferredCommunication: e.target.value as 'email' | 'whatsapp' | 'telegram' })
                      }
                      label={t('login.preferredCommunication')}
                    >
                      <MenuItem value="email">{t('login.comm.email')}</MenuItem>
                      <MenuItem value="whatsapp">{t('login.comm.whatsapp')}</MenuItem>
                      <MenuItem value="telegram">{t('login.comm.telegram')}</MenuItem>
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    onClick={handleSellerRegistration}
                    className={styles.loginButton}
                    aria-label={t('login.registerSeller')}
                  >
                    {t('login.registerSeller')}
                  </Button>
                </Box>
              )}
            </>
          )}
        </Box>
      </motion.div>
    </Container>
  );
};

export default LoginPage;