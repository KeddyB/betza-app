import { View, Text, Image, StyleSheet, Dimensions, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '@/lib/types';
import { useCart } from '@/app/context/CartContext';
import { useToast } from '@/app/context/ToastContext';
import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

const { width } = Dimensions.get('window');
const productWidth = (width - 48) / 2;

export default function ProductCard({ product, onPress }: ProductCardProps) {
  const { cart, addToCart, removeFromCart, updateCartQuantity } = useCart();
  const { showToast } = useToast();
  const { colorScheme } = useTheme();
  const themeColors = Colors[colorScheme ?? 'light'];

  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    const cartItem = cart.find(item => item.id === product.id);
    setQuantity(cartItem ? cartItem.quantity : 0);
  }, [cart, product.id]);

  const handleAddToCart = useCallback(() => {
    addToCart(product, 1);
    showToast(`${product.name} added to cart!`, 'success', 'top');
  }, [product, addToCart, showToast]);

  const incrementQuantity = useCallback(() => {
    updateCartQuantity(product.id, quantity + 1);
  }, [product.id, quantity, updateCartQuantity]);

  const decrementQuantity = useCallback(() => {
    if (quantity === 1) {
      removeFromCart(product.id);
      showToast(`${product.name} removed from cart!`, 'info', 'top');
    } else {
      updateCartQuantity(product.id, quantity - 1);
    }
  }, [product.id, quantity, removeFromCart, updateCartQuantity, showToast]);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { width: productWidth, backgroundColor: themeColors.card },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image_url }}
          style={styles.image}
          resizeMode="contain"
        />
        <View style={styles.priceContainer}>
          <Text style={styles.productPrice}>₦{product.price.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={[styles.productName, { color: themeColors.text }]} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={[styles.categoryName, { color: themeColors.text + '99' }]} numberOfLines={1}>
          Household Equipment
        </Text>
      </View>

      {quantity === 0 ? (
        <Pressable
          style={({ pressed }) => [
              styles.addToCartButton,
              {
                backgroundColor: pressed ? '#10B981E6' : '#10B981',
              }
          ]}
          onPress={(e) => {
              e.stopPropagation();
              handleAddToCart();
          }}
        >
          <Ionicons name="cart-outline" size={18} color="#fff" />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </Pressable>
      ) : (
        <View style={styles.quantityControl}>
          <Pressable onPress={decrementQuantity} style={styles.controlButton}>
            <Ionicons name={quantity === 1 ? 'trash-outline' : 'remove'} size={18} color={'#10B981'} />
          </Pressable>
          <Text style={[styles.quantityText, { color: themeColors.text }]}>{quantity}</Text>
          <Pressable onPress={incrementQuantity} style={styles.controlButton}>
            <Ionicons name="add" size={18} color={'#10B981'} />
          </Pressable>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    padding: 10,
  },
  imageContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'transparent',
    marginBottom: 10,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  priceContainer: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#D1FAE5',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#064E3B',
  },
  content: {
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryName: {
    fontSize: 12,
    marginTop: 2,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  controlButton: {
    paddingHorizontal: 12,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.8,
  }
});
