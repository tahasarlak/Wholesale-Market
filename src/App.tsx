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
import AddProductPage from './Pages/AddProductPage/AddProductPage';
import SellerDashboardPage from './Pages/SellerDashboardPage/SellerDashboardPage';
import AdminPanelPage from './Pages/AdminPanelPage/AdminPanelPage';
import PurchaseRequestsPage from './Pages/PurchaseRequestsPage/PurchaseRequestsPage';
import WishlistPage from './Pages/WishlistPage/WishlistPage';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { ProductContext, ProductContextType, initialProducts, initialSellers, Product, Seller, PurchaseRequest } from './context/ProductContext';
import { ThemeContext, ThemeContextType } from './context/ThemeContext';
import { AuthContextProvider } from './context/AuthContext';
import { WishlistContext, WishlistContextType } from './context/WishlistContext';
import './styles/global.css';
import { CircularProgress } from '@mui/material';
import Layout from './Layout';

const AppContent: React.FC = () => {
  const { t } = useTranslation();

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark' || window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [sellers, setSellers] = useState<Seller[]>(initialSellers);
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);
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
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const submitPurchaseRequest = async (
    productId: number,
    quantity: number,
    buyerContact: { email?: string; whatsapp?: string; telegram?: string },
    proposedPrice?: string
  ) => {
    setIsLoading(true);
    try {
      const product = products.find((p) => p.id === productId);
      if (!product) throw new Error('Product not found');
      const newRequest: PurchaseRequest = {
        id: purchaseRequests.length + 1,
        productId,
        sellerId: product.sellerId,
        buyerId: 0, // Will be set by AuthContext in real implementation
        quantity,
        proposedPrice,
        status: 'pending',
        createdAt: new Date().toISOString(),
        buyerContact,
      };
      setPurchaseRequests((prev) => [...prev, newRequest]);
      toast.success(t('app.purchaseRequestSubmitted'));
    } catch (err) {
      setError(t('app.purchaseRequestError'));
      toast.error(t('app.purchaseRequestError'));
    } finally {
      setIsLoading(false);
    }
  };

  const sendNotification = async (recipientId: number, message: string, method: 'email' | 'whatsapp' | 'telegram') => {
    try {
      console.log(`Sending ${method} notification to user ${recipientId}: ${message}`);
      toast.success(t('app.notificationSent'));
    } catch (err) {
      toast.error(t('app.notificationError'));
    }
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
      sellers,
      purchaseRequests,
      submitPurchaseRequest,
      sendNotification,
      isLoading,
      error,
    }),
    [products, sellers, purchaseRequests, isLoading, error]
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
      target: `${window.location.origin}/products?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme } as ThemeContextType}>
      <AuthContextProvider>
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
                    <Route path="/purchase-requests" element={<PurchaseRequestsPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/add-product" element={<AddProductPage />} />
                    <Route path="/seller-dashboard" element={<SellerDashboardPage />} />
                    <Route path="/admin-panel" element={<AdminPanelPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                  </Route>
                </Routes>
              </ErrorBoundary>
            </Router>
          </WishlistContext.Provider>
        </ProductContext.Provider>
      </AuthContextProvider>
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