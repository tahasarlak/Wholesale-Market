

// src/App.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Helmet } from 'react-helmet-async';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import i18n from './i18n/i18n';
import HomePage from './Pages/HomePage/HomePage';
import ProductsPage from './Pages/ProductsPage/ProductsPage';
import ContactPage from './Pages/ContactPage/ContactPage';
import ProductDetailPage from './Pages/ProductsPage/ProductDetailPage/ProductDetailPage';
import LoginPage from './Pages/LoginPage/LoginPage';
import ProfilePage from './Pages/ProfilePage/ProfilePage';
import OrdersPage from './Pages/OrdersPage/OrdersPage';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { Product, ProductContext, ProductContextType, initialProducts, CartItem } from './context/ProductContext';
import { ThemeContext, ThemeContextType } from './context/ThemeContext';
import { AuthContext, AuthContextType } from './context/AuthContext';
import { WishlistContext, WishlistContextType } from './context/WishlistContext';
import './styles/global.css';
import { CircularProgress } from '@mui/material';
import Layout from './Layout';
import CartPage from './Pages/CartPage/CartPage';
import SearchPage from './Pages/SearchPage/SearchPage';

const AppContent: React.FC = () => {
  const { t } = useTranslation();

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark' || window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('token');
  });
  const [products] = useState<Product[]>(initialProducts);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  });
  const [wishlist, setWishlist] = useState<number[]>(() => {
    return JSON.parse(localStorage.getItem('wishlist') || '[]');
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const toggleAuth = () => {
    setIsAuthenticated((prev) => {
      const newState = !prev;
      if (newState) {
        localStorage.setItem('token', 'dummy-token');
        toast.success(t('auth.loggedIn'));
      } else {
        localStorage.removeItem('token');
        toast.info(t('auth.loggedOut'));
      }
      return newState;
    });
  };

  const addToCart = (productId: number, quantity: number) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.productId === productId);
      if (existingItem) {
        return prev.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { productId, quantity }];
    });
    toast.success(t('products.addedToCart', { name: products.find((p) => p.id === productId)?.name || 'Product' }));
  };

  const removeFromCart = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
    toast.info(t('cart.removedFromCart', { name: products.find((p) => p.id === productId)?.name || 'Product' }));
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const toggleWishlist = (productId: number) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        toast.info(t('wishlist.removed'));
        return prev.filter((id) => id !== productId);
      }
      toast.success(t('wishlist.added'));
      return [...prev, productId];
    });
  };

  const isInWishlist = (productId: number) => wishlist.includes(productId);

  const productContextValue: ProductContextType = useMemo(
    () => ({
      products,
      cartItems,
      addToCart,
      removeFromCart,
      getCartItemCount,
      isLoading,
      error,
    }),
    [products, cartItems, isLoading, error]
  );

  const authContextValue: AuthContextType = useMemo(
    () => ({
      isAuthenticated,
      toggleAuth,
    }),
    [isAuthenticated]
  );

  const wishlistContextValue: WishlistContextType = useMemo(
    () => ({
      wishlist,
      toggleWishlist,
      isInWishlist,
    }),
    [wishlist]
  );

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: t('app.title'),
    url: window.location.origin,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${window.location.origin}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme } as ThemeContextType}>
      <AuthContext.Provider value={authContextValue}>
        <ProductContext.Provider value={productContextValue}>
          <WishlistContext.Provider value={wishlistContextValue}>
            <Router>
              <Helmet>
                <title>{t('app.title')}</title>
                <meta name="description" content={t('app.description')} />
                <link rel="canonical" href={window.location.href} />
                <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
              </Helmet>
              <ErrorBoundary>
                <Routes>
                  <Route element={<Layout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/products/:id" element={<ProductDetailPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/categories/:category" element={<ProductsPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                  </Route>
                </Routes>
              </ErrorBoundary>
            </Router>
          </WishlistContext.Provider>
        </ProductContext.Provider>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
};

const App: React.FC = () => {
  const [isI18nReady, setIsI18nReady] = useState(false);

  useEffect(() => {
    if (i18n.isInitialized) {
      setIsI18nReady(true);
    } else {
      i18n.on('initialized', () => {
        setIsI18nReady(true);
      });
    }
  }, []);

  if (!isI18nReady) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <HelmetProvider>
      <I18nextProvider i18n={i18n}>
        <AppContent />
      </I18nextProvider>
    </HelmetProvider>
  );
};

export default App;