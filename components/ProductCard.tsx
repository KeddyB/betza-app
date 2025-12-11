import { View, Text, Image, StyleSheet, Dimensions, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '@/lib/types';
import { useCart } from '@/app/context/CartContext';
import { useToast } from '@/app/context/ToastContext';
import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useWishlist } from '@/app/context/WishlistContext';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  carouselMode?: boolean;
}

const { width } = Dimensions.get('window');
const productWidth = (width - 48) / 2; // Correct width for a 2-column grid with 16px padding and 16px gap
const carouselProductWidth = width / 2.5;

export default function ProductCard({ product, onPress, carouselMode = false }: ProductCardProps) {
  const calculatedCardWidth = carouselMode ? carouselProductWidth : productWidth;
  const { cart, addToCart, removeFromCart, updateCartQuantity } = useCart();
  const { showToast } = useToast();
  const [addingToCart, setAddingToCart] = useState(false);
  const { colorScheme } = useTheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const { wishlist, addToWishlist, removeFromWishlist, isProductInWishlist } = useWishlist();

  const [quantity, setQuantity] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    const cartItem = cart.find(item => item.id === product.id);
    setQuantity(cartItem ? cartItem.quantity : 0);
  }, [cart, product.id]);

  useEffect(() => {
    setIsInWishlist(isProductInWishlist(product.id));
  }, [wishlist, product.id, isProductInWishlist]);

  const handleAddToCart = useCallback(() => {
    if (product) {
      setAddingToCart(true);
      setTimeout(() => {
        addToCart(product, 1);
        showToast(`${product.name} added to cart!`, 'success', 'top');
        setAddingToCart(false);
      }, 500);
    }
  }, [product, addToCart, showToast]);

  const incrementQuantity = useCallback(() => {
    if (product) {
      updateCartQuantity(product.id, quantity + 1);
    }
  }, [product, quantity, updateCartQuantity]);

  const decrementQuantity = useCallback(() => {
    if (product) {
      if (quantity === 1) {
        removeFromCart(product.id);
        showToast(`${product.name} removed from cart!`, 'info', 'top');
      } else if (quantity > 1) {
        updateCartQuantity(product.id, quantity - 1);
      }
    }
  }, [product, quantity, removeFromCart, updateCartQuantity, showToast]);

  const handleWishlistToggle = () => {
    if (product) {
      if (isInWishlist) {
        removeFromWishlist(product.id);
        showToast(`${product.name} removed from wishlist!`, 'info', 'top');
      } else {
        addToWishlist(product);
        showToast(`${product.name} added to wishlist!`, 'success', 'top');
      }
    }
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { width: calculatedCardWidth, backgroundColor: themeColors.card, borderColor: themeColors.border },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image_url }}
          style={styles.image}
          resizeMode="contain"
        />
        <Pressable
          style={({ pressed }) => [styles.heartIcon, { backgroundColor: themeColors.card }, pressed && styles.pressed]}
          onPress={(e) => {
            e.stopPropagation();
            handleWishlistToggle();
          }}
        >
          <Ionicons
            name={isInWishlist ? 'heart' : 'heart-outline'}
            size={20}
            color={isInWishlist ? themeColors.notification : themeColors.text}
          />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={[styles.productPrice, { color: themeColors.primary }]}>₦{product.price.toFixed(2)}</Text>
        <Text style={[styles.productName, { color: themeColors.text }]} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={[styles.unit, { color: themeColors.text + '80' }]}>per unit</Text>

        {quantity === 0 ? (
          <Pressable
            style={({ pressed }) => [styles.addButton, { backgroundColor: themeColors.primary }, pressed && styles.pressed]}
            onPress={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            disabled={addingToCart}
          >
            {addingToCart ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="add" size={16} color="#fff" />
                <Text style={styles.addText}>Add to cart</Text>
              </>
            )}
          </Pressable>
        ) : (
          <View style={[styles.quantityContainer, { backgroundColor: themeColors.inputBackground }]}>
            <Pressable
              style={({ pressed }) => [styles.quantityButton, pressed && styles.pressed]}
              onPress={(e) => {
                e.stopPropagation();
                decrementQuantity();
              }}
            >
              <Text style={[styles.quantityButtonText, { color: themeColors.primary }]}>−</Text>
            </Pressable>
            <Text style={[styles.quantityText, { color: themeColors.text }]}>{quantity}</Text>
            <Pressable
              style={({ pressed }) => [styles.quantityButton, pressed && styles.pressed]}
              onPress={(e) => {
                e.stopPropagation();
                incrementQuantity();
              }}
            >
              <Text style={[styles.quantityButtonText, { color: themeColors.primary }]}>+</Text>
            </Pressable>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 140, // Reduced image height to make room for text
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heartIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
    borderRadius: 20,
  },
  content: {
    padding: 12,
    flex: 1, // Allows content to expand and push add/quantity to bottom
    justifyContent: 'space-between', // Distribute content vertically
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 2,
    height: 36, // Fixed height for consistent product name area
  },
  unit: {
    fontSize: 12,
    marginBottom: 8,
  },
  addButton: {
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  addText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    paddingVertical: 6,
  },
  quantityButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  quantityText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  }
});