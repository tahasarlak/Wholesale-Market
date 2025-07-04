import { createContext, useContext } from 'react';

export interface WishlistContextType {
  wishlist: number[];
  toggleWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
}

export const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlistContext = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlistContext must be used within a WishlistContext.Provider');
  }
  return context;
};