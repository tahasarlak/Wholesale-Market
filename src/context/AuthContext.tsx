import { createContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-toastify';

export enum UserRole {
  BUYER = 'buyer',
  SELLER = 'seller',
  ADMIN = 'admin',
}

export interface SellerInfo {
  businessName: string;
  whatsappNumber?: string;
  telegramUsername?: string;
  preferredCommunication: 'email' | 'whatsapp' | 'telegram';
  paymentMethods: string[];
  verificationStatus: 'pending' | 'verified' | 'rejected';
}

export interface BuyerInfo {
  preferredContact: 'email' | 'whatsapp' | 'telegram';
}

export interface User {
  id: number;
  name: string;
  email: string;
  roles: UserRole[];
  activeRole?: UserRole;
  sellerInfo?: SellerInfo;
  buyerInfo?: BuyerInfo;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string, roles: UserRole[]) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  registerSeller: (sellerData: { name: string; email: string; businessName: string; whatsappNumber?: string; telegramUsername?: string; preferredCommunication: 'email' | 'whatsapp' | 'telegram'; paymentMethods: string[] }) => Promise<void>;
  approveSeller: (sellerId: number) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string, roles: UserRole[]) => {
    // Simulate login
    const newUser: User = {
      id: 1,
      name: email.split('@')[0],
      email,
      roles,
      activeRole: roles[0],
      buyerInfo: { preferredContact: 'email' },
      sellerInfo: roles.includes(UserRole.SELLER) ? { businessName: '', verificationStatus: 'pending', preferredCommunication: 'email', paymentMethods: [] } : undefined,
    };
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('token', 'dummy-token');
    toast.success('Logged in successfully');
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    toast.info('Logged out successfully');
  };

  const switchRole = (role: UserRole) => {
    if (user && user.roles.includes(role)) {
      setUser({ ...user, activeRole: role });
      toast.info(`Switched to ${role} role`);
    }
  };

  const registerSeller = async (sellerData: { name: string; email: string; businessName: string; whatsappNumber?: string; telegramUsername?: string; preferredCommunication: 'email' | 'whatsapp' | 'telegram'; paymentMethods: string[] }) => {
    if (user) {
      setUser({
        ...user,
        roles: [...user.roles, UserRole.SELLER],
        sellerInfo: { ...sellerData, verificationStatus: 'pending' },
      });
    }
  };

  const approveSeller = async (sellerId: number) => {
    // Simulate seller approval
    toast.success(`Seller ${sellerId} approved`);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, switchRole, registerSeller, approveSeller }}>
      {children}
    </AuthContext.Provider>
  );
};