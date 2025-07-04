import React, { useContext, useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  TextField,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
  Modal,
  Box,
  ListItemIcon,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faSearch, faBars, faSun, faMoon, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { motion, useReducedMotion, Variants } from 'framer-motion';
import { AuthContext, AuthContextType } from '../../context/AuthContext';
import { ThemeContext, ThemeContextType } from '../../context/ThemeContext';
import { ProductContext, ProductContextType } from '../../context/ProductContext';
import { useTranslation } from 'react-i18next';
import styles from './Header.module.css';

interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, toggleAuth } = useContext(AuthContext) as AuthContextType;
  const { isDarkMode, toggleTheme } = useContext(ThemeContext) as ThemeContextType;
  const { cartItems } = useContext(ProductContext) as ProductContextType;
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [languageModalOpen, setLanguageModalOpen] = useState<boolean>(false);
  const [flagStatus, setFlagStatus] = useState<Record<string, boolean>>({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const shouldReduceMotion = useReducedMotion();

  const languageOptions: LanguageOption[] = [
    { code: 'en', name: 'English', flag: 'https://flagcdn.com/w20/us.png' },
    { code: 'fa', name: 'فارسی', flag: 'https://flagcdn.com/w20/ir.png' },
  ];

  // Check flag image loading status
  useEffect(() => {
    const status: Record<string, boolean> = {};
    languageOptions.forEach((lang) => {
      const img = new Image();
      img.src = lang.flag;
      img.onload = () => setFlagStatus((prev) => ({ ...prev, [lang.code]: true }));
      img.onerror = () => setFlagStatus((prev) => ({ ...prev, [lang.code]: false }));
    });
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const toggleLanguageModal = () => {
    setLanguageModalOpen(!languageModalOpen);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    toggleLanguageModal();
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { to: '/', label: t('header.home') },
    { to: '/products', label: t('header.products') },
    { to: '/orders', label: t('header.orders') },
    { to: '/contact', label: t('header.contact') },
    { to: '/profile', label: t('header.profile') },
  ];

  // Animation variants for header
  const headerVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.5,
        ease: 'easeOut' as const,
      },
    },
  };

  // Animation variants for buttons and icons
  const buttonVariants: Variants = {
    rest: { scale: 1 },
    hover: {
      scale: shouldReduceMotion ? 1 : 1.1,
      transition: { duration: shouldReduceMotion ? 0 : 0.3, ease: 'easeOut' as const },
    },
  };

  return (
    <motion.div
      className={`${styles.header} ${isDarkMode ? styles.dark : styles.light}`}
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <AppBar position="fixed" className={styles.appBar}>
        <Toolbar className={styles.toolbar}>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            className={styles.logo}
            aria-label="Wholesale Market Home"
          >
            Wholesale Market
          </Typography>

          {!isMobile && (
            <div className={styles.navContainer}>
              {navLinks.map((link) => (
                <motion.div key={link.to} variants={buttonVariants} initial="rest" whileHover="hover">
                  <Button
                    component={RouterLink}
                    to={link.to}
                    className={styles.navButton}
                    aria-label={link.label}
                  >
                    {link.label}
                  </Button>
                </motion.div>
              ))}
              <motion.div variants={buttonVariants} initial="rest" whileHover="hover">
                <Button
                  onClick={toggleAuth}
                  className={styles.navButton}
                  aria-label={isAuthenticated ? t('header.logout') : t('header.login')}
                >
                  {isAuthenticated ? t('header.logout') : t('header.login')}
                </Button>
              </motion.div>
            </div>
          )}

          <div className={styles.actions}>
            <TextField
              variant="outlined"
              placeholder={t('header.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className={styles.searchInput}
              size="small"
              aria-label={t('header.searchAria')}
            />
            <motion.div variants={buttonVariants} initial="rest" whileHover="hover">
              <IconButton
                onClick={handleSearch}
                className={styles.searchButton}
                aria-label={t('header.search')}
              >
                <FontAwesomeIcon icon={faSearch} />
              </IconButton>
            </motion.div>
            <motion.div variants={buttonVariants} initial="rest" whileHover="hover">
              <IconButton
                component={RouterLink}
                to="/cart"
                className={styles.cartIcon}
                aria-label={t('header.cartAria', { count: cartItemCount })}
              >
                <Badge badgeContent={cartItemCount} className={styles.cartBadge}>
                  <FontAwesomeIcon icon={faShoppingCart} />
                </Badge>
              </IconButton>
            </motion.div>
            <motion.div variants={buttonVariants} initial="rest" whileHover="hover">
              <IconButton
                onClick={toggleTheme}
                className={styles.themeToggleButton}
                aria-label={isDarkMode ? t('header.lightMode') : t('header.darkMode')}
              >
                <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
              </IconButton>
            </motion.div>
            <motion.div variants={buttonVariants} initial="rest" whileHover="hover">
              <IconButton
                onClick={toggleLanguageModal}
                className={styles.languageButton}
                aria-label={t('header.language')}
              >
                <FontAwesomeIcon icon={faGlobe} />
              </IconButton>
            </motion.div>
            {isMobile && (
              <motion.div variants={buttonVariants} initial="rest" whileHover="hover">
                <IconButton
                  edge="end"
                  onClick={toggleDrawer}
                  className={styles.menuButton}
                  aria-label={t('header.menu')}
                >
                  <FontAwesomeIcon icon={faBars} />
                </IconButton>
              </motion.div>
            )}
          </div>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer}
        classes={{ paper: styles.drawerPaper }}
        className={styles.drawer}
      >
        <List className={styles.drawerList}>
          {navLinks.map((link) => (
            <ListItem
              button
              key={link.to}
              component={RouterLink}
              to={link.to}
              onClick={toggleDrawer}
              className={styles.drawerListItem}
            >
              <ListItemText primary={link.label} />
            </ListItem>
          ))}
          <ListItem
            button
            onClick={() => {
              toggleAuth();
              toggleDrawer();
            }}
            className={styles.drawerListItem}
          >
            <ListItemText primary={isAuthenticated ? t('header.logout') : t('header.login')} />
          </ListItem>
        </List>
      </Drawer>

      <Modal
        open={languageModalOpen}
        onClose={toggleLanguageModal}
        aria-labelledby="language-modal-title"
        className={styles.languageModal}
      >
        <Box className={styles.languageModalBox}>
          <Typography
            id="language-modal-title"
            variant="h6"
            component="h2"
            className={styles.languageModalTitle}
          >
            {t('header.selectLanguage')}
          </Typography>
          <List className={styles.languageList}>
            {languageOptions.map((lang) => (
              <ListItem
                button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={styles.languageListItem}
              >
                <ListItemIcon className={styles.languageIcon}>
                  {flagStatus[lang.code] !== false ? (
                    <img
                      src={lang.flag}
                      alt={`${lang.name} Flag`}
                      className={styles.flagImage}
                    />
                  ) : (
                    <Box
                      className={styles.flagFallback}
                      aria-label="Flag image failed to load"
                    />
                  )}
                </ListItemIcon>
                <ListItemText primary={lang.name} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Modal>
    </motion.div>
  );
};

export default Header;