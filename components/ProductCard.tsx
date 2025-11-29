import { View, Text, Image, StyleSheet, Dimensions, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '@/lib/types';
import { useCart } from '@/app/context/CartContext';
import { useToast } from '@/app/context/ToastContext';
import { useState, useEffect, useCallback } from 'react'; // Import useEffect and useCallback
import { useTheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  carouselMode?: boolean;
}

const { width } = Dimensions.get('window');
const productWidth = (width - 60) / 2; // (Total width - padding - gap) / 2
const carouselProductWidth = width / 2.5;

export default function ProductCard({ product, onPress, carouselMode = false }: ProductCardProps) {
  const calculatedCardWidth = carouselMode ? carouselProductWidth : productWidth;
  const { cart, addToCart, removeFromCart, updateCartQuantity } = useCart(); // Destructure new functions
  const { showToast } = useToast();
  const [addingToCart, setAddingToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { colorScheme } = useTheme();

  // Get current quantity from cart
  const currentQuantity = cart.find(item => item.id === product.id)?.quantity || 0;
  const [quantity, setQuantity] = useState(currentQuantity);

  useEffect(() => {
    setQuantity(currentQuantity);
  }, [currentQuantity]);

  const handleAddToCart = useCallback(() => {
    setAddingToCart(true);
    // Simulate async operation
    setTimeout(() => {
      addToCart(product, 1); // Add 1 to cart
      showToast(`${product.name} added to cart!`, 'success');
      setAddingToCart(false);
    }, 500);
  }, [product, addToCart, showToast]);

  const incrementQuantity = useCallback(() => {
    updateCartQuantity(product.id, quantity + 1);
  }, [product.id, quantity, updateCartQuantity]);

  const decrementQuantity = useCallback(() => {
    if (quantity === 1) {
      removeFromCart(product.id);
      showToast(`${product.name} removed from cart!`, 'info');
    } else if (quantity > 1) {
      updateCartQuantity(product.id, quantity - 1);
    }
  }, [product.id, quantity, updateCartQuantity, removeFromCart, showToast]);

  return (
        <Pressable
          onPress={onPress}
          style={({ pressed }) => [
            styles.card,
            { width: calculatedCardWidth, backgroundColor: Colors[colorScheme ?? 'light'].card, borderColor: Colors[colorScheme ?? 'light'].border },
            pressed && styles.pressed,
          ]}
        >
            <View style={styles.imageContainer}>
                <Image
                  source={{ uri: product.image_url }}
                  style={styles.image}
                  resizeMode="contain"
                />
                {/* Heart Icon */}
                <Pressable
                  style={({ pressed }) => [styles.heartIcon, { backgroundColor: Colors[colorScheme ?? 'light'].card }, pressed && styles.pressed]}
                  onPress={() => setIsFavorite(!isFavorite)}
                >
                  <Ionicons
                    name={isFavorite ? 'heart' : 'heart-outline'}
                    size={20}
                    color={isFavorite ? Colors[colorScheme ?? 'light'].notification : Colors[colorScheme ?? 'light'].text}
                  />
                </Pressable>
                {/* New Badge - example, can be conditional */}
                {/* <View style={[styles.newBadge, { backgroundColor: Colors[colorScheme ?? 'light'].accent }]}>
                  <Text style={styles.newBadgeText}>NEW</Text>
                </View> */}
            </View>
      <View style={styles.content}>
        <Text style={[styles.productPrice, { color: Colors[colorScheme ?? 'light'].primary }]}>₦{product.price.toFixed(2)}</Text>
        <Text style={[styles.productName, { color: Colors[colorScheme ?? 'light'].text }]} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={[styles.unit, { color: Colors[colorScheme ?? 'light'].text + '80' }]}>per unit</Text> {/* Assuming 'per unit' for now */}

        {quantity === 0 ? (
          <Pressable 
            style={({ pressed }) => [styles.addButton, { backgroundColor: Colors[colorScheme ?? 'light'].primary }, pressed && styles.pressed]}
            onPress={handleAddToCart}
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
          <View style={[styles.quantityContainer, { backgroundColor: Colors[colorScheme ?? 'light'].inputBackground }]}>
            <Pressable 
              style={({ pressed }) => [styles.quantityButton, pressed && styles.pressed]}
              onPress={decrementQuantity}
            >
              <Text style={[styles.quantityButtonText, { color: Colors[colorScheme ?? 'light'].primary }]}>−</Text>
            </Pressable>
            <Text style={[styles.quantityText, { color: Colors[colorScheme ?? 'light'].text }]}>{quantity}</Text>
            <Pressable 
              style={({ pressed }) => [styles.quantityButton, pressed && styles.pressed]}
              onPress={incrementQuantity}
            >
              <Text style={[styles.quantityButtonText, { color: Colors[colorScheme ?? 'light'].primary }]}>+</Text>
            </Pressable>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    marginRight: 12,
    height: 300, // Fixed height for consistent card size
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 140, // Reduced image height to make room for text
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: '80%',
  },
  heartIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
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