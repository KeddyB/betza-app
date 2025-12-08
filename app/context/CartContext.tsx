import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext'; 

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateCartQuantity: (productId: number, newQuantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const mergeAndFetchCart = async () => {
      if (user) {
        // If there's a local cart, merge it with the backend cart.
        if (cart.length > 0) {
          for (const item of cart) {
            await addToCart(item, item.quantity, true); 
          }
        }
        await fetchCart();
      }
    };
    mergeAndFetchCart();
  }, [user]);

  const fetchCart = async () => {
    if (!user) return;
    try {
      const { data: cartData, error: cartError } = await supabase
        .from('user_carts')
        .select('product_id, quantity')
        .eq('user_id', user.id);

      if (cartError) throw cartError;
      if (!cartData || cartData.length === 0) {
        setCart([]);
        return;
      }

      const productIds = cartData.map(item => item.product_id);
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds);

      if (productsError) throw productsError;

      const fetchedCart = cartData.map(cartItem => {
        const product = productsData.find(p => p.id === cartItem.product_id);
        return {
          ...product,
          quantity: cartItem.quantity,
        };
      }).filter(item => item.id); // Ensure product was found

      setCart(fetchedCart as CartItem[]);

    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const addToCart = async (product: Product, quantity: number = 1, fromMerge = false) => {
    if (user) {
        const { data: existingItem } = await supabase
            .from('user_carts')
            .select('*')
            .eq('user_id', user.id)
            .eq('product_id', product.id)
            .single();

        if (existingItem) {
            await supabase
                .from('user_carts')
                .update({ quantity: existingItem.quantity + quantity })
                .eq('user_id', user.id)
                .eq('product_id', product.id);
        } else {
            await supabase
                .from('user_carts')
                .insert([{ user_id: user.id, product_id: product.id, quantity }]);
        }
        if (!fromMerge) await fetchCart();
    } else {
      setCart(prevCart => {
        const existing = prevCart.find(item => item.id === product.id);
        if (existing) {
          return prevCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
        }
        return [...prevCart, { ...product, quantity }];
      });
    }
  };

  const removeFromCart = async (productId: number) => {
    if (user) {
      await supabase
        .from('user_carts')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);
      await fetchCart();
    } else {
      setCart(prevCart => prevCart.filter(item => item.id !== productId));
    }
  };

  const updateCartQuantity = async (productId: number, newQuantity: number) => {
    if (user) {
      if (newQuantity <= 0) {
        await removeFromCart(productId);
      } else {
        await supabase
          .from('user_carts')
          .update({ quantity: newQuantity })
          .eq('user_id', user.id)
          .eq('product_id', productId);
        await fetchCart();
      }
    } else {
      setCart(prevCart => {
          if (newQuantity <= 0) {
              return prevCart.filter(item => item.id !== productId);
          } else {
              return prevCart.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item);
          }
      });
    }
  };

  const clearCart = async () => {
    if (user) {
      await supabase
        .from('user_carts')
        .delete()
        .eq('user_id', user.id);
    }
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateCartQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
