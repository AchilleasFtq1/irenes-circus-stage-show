import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { IProduct } from '@/lib/types';

type CartItem = { product: IProduct; quantity: number };

interface CartContextValue {
  items: CartItem[];
  add: (product: IProduct, quantity?: number) => void;
  remove: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  totalCents: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem('cart_items');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart_items', JSON.stringify(items));
  }, [items]);

  const add = (product: IProduct, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.product._id === product._id);
      if (existing) {
        return prev.map(i => i.product._id === product._id ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { product, quantity }];
    });
  };

  const remove = (productId: string) => {
    setItems(prev => prev.filter(i => i.product._id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      remove(productId);
    } else {
      setItems(prev => prev.map(i => i.product._id === productId ? { ...i, quantity } : i));
    }
  };

  const clear = () => setItems([]);

  const totalCents = useMemo(() => items.reduce((sum, it) => sum + it.product.priceCents * it.quantity, 0), [items]);

  const value = useMemo(() => ({ items, add, remove, updateQuantity, clear, totalCents }), [items, totalCents]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};


