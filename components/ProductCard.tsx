import { View, Text, Image, StyleSheet, Dimensions, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '@/lib/types';
import { useCart } from '@/app/context/CartContext';
import { useToast } from '@/app/context/ToastContext';
import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { supabase } from '@/lib/supabase';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
<<<<<<< HEAD
  carouselMode?: boolean;
}

const { width } = Dimensions.get('window');
const productWidth = (width - 48) / 2; // Adjusted for padding and gap

export default function ProductCard({ product, onPress, carouselMode = false }: ProductCardProps) {
=======
  width?: number;
}

const { width: screenWidth } = Dimensions.get('window');
const defaultProductWidth = (screenWidth - 48) / 2;

export default function ProductCard({ product, onPress, width = defaultProductWidth }: ProductCardProps) {
>>>>>>> test-fix
  const { cart, addToCart, removeFromCart, updateCartQuantity } = useCart();
  const { showToast } = useToast();
  const [addingToCart, setAddingToCart] = useState(false);
  const { colorScheme } = useTheme();

<<<<<<< HEAD
  // Get current quantity from cart
  const currentQuantity = cart.find(item => item.id === product.id)?.quantity || 0;
  const [quantity, setQuantity] = useState(currentQuantity);
=======
  const [quantity, setQuantity] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(true);

  const getUserId = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id;
  };
>>>>>>> test-fix

  useEffect(() => {
    setQuantity(currentQuantity);
  }, [currentQuantity]);

  useEffect(() => {
    const checkIfInWishlist = async () => {
      setLoadingWishlist(true);
      const userId = await getUserId();
      if (!userId) {
        setLoadingWishlist(false);
        return;
      }
      const { data, error } = await supabase
        .from('wishlist')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', product.id)
        .single();

      if (data && !error) {
        setIsInWishlist(true);
      } else {
        setIsInWishlist(false);
      }
      setLoadingWishlist(false);
    };
    checkIfInWishlist();
  }, [product.id]);

  const handleAddToCart = useCallback(() => {
    setAddingToCart(true);
    // Simulate async operation
    setTimeout(() => {
      addToCart(product, 1); // Add 1 to cart
      showToast(`${product.name} added to cart!`, 'success');
      setAddingToCart(false);
    }, 300);
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
  }, [product.id, quantity, updateCartQuantity, removeFromCart, showToast, product.name]);

  // Mock rating if missing
  const rating = product.rating || 4.8;
  const reviewCount = product.review_count || 287;

  const handleWishlistToggle = async () => {
    const userId = await getUserId();
    if (!userId) {
      showToast('You must be logged in to manage your wishlist.', 'error', 'top');
      return;
    }

    if (isInWishlist) {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', product.id);
      if (error) {
        showToast('Error removing from wishlist.', 'error', 'top');
      } else {
        setIsInWishlist(false);
        showToast(`${product.name} removed from wishlist.`, 'info', 'top');
      }
    } else {
      const { error } = await supabase
        .from('wishlist')
        .insert({ user_id: userId, product_id: product.id });
      if (error) {
        showToast('Error adding to wishlist.', 'error', 'top');
      } else {
        setIsInWishlist(true);
        showToast(`${product.name} added to wishlist!`, 'success', 'top');
      }
    }
  };


  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
<<<<<<< HEAD
        { width: productWidth, backgroundColor: Colors[colorScheme ?? 'light'].card }, // Removed border for cleaner look
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.imageContainer, { backgroundColor: '#F8F8F8' }]}>
        <Image
          source={{ uri: product.image_url }}
          style={styles.image}
          resizeMode="contain"
        />
        {/* Floating Add Button / Quantity Control */}
        <View style={styles.floatingButtonContainer}>
             {quantity === 0 ? (
                <Pressable
                    style={styles.addButton}
                    onPress={(e) => {
                        e.stopPropagation();
                        handleAddToCart();
                    }}
                    disabled={addingToCart}
                >
                    {addingToCart ? (
                        <ActivityIndicator size="small" color="#000" />
                    ) : (
                        <Ionicons name="add" size={24} color="#000" />
                    )}
                </Pressable>
             ) : (
                <View style={styles.quantityControl}>
                    <Pressable
                        style={styles.controlButton}
                        onPress={(e) => {
                            e.stopPropagation();
                            decrementQuantity();
                        }}
                    >
                         <Ionicons name={quantity === 1 ? "trash-outline" : "remove"} size={16} color="#000" />
                    </Pressable>
                    <Text style={styles.quantityText}>{quantity}</Text>
                    <Pressable
                        style={styles.controlButton}
                        onPress={(e) => {
                            e.stopPropagation();
                            incrementQuantity();
                        }}
                    >
                        <Ionicons name="add" size={16} color="#000" />
                    </Pressable>
                </View>
             )}
=======
        { width: width, backgroundColor: themeColors.card },
        pressed && styles.pressed,
      ]}
    >
        <View style={styles.imageContainer}>
            <Pressable
                style={styles.wishlistButton}
                onPress={(e) => {
                    e.stopPropagation();
                    handleWishlistToggle();
                }}
                disabled={loadingWishlist}
                >
                <Ionicons
                    name={isInWishlist ? 'heart' : 'heart-outline'}
                    size={24}
                    color={isInWishlist ? themeColors.primary : themeColors.text}
                />
            </Pressable>
            <Image
            source={{ uri: product.image_url }}
            style={styles.image}
            resizeMode="contain"
            />
            <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>₦{product.price.toFixed(2)}</Text>
            </View>
>>>>>>> test-fix
        </View>

<<<<<<< HEAD
      <View style={styles.content}>
        <Text style={[styles.productName, { color: Colors[colorScheme ?? 'light'].text }]} numberOfLines={1}>
          {product.name}
        </Text>

        <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFC107" />
            <Text style={[styles.ratingText, { color: Colors[colorScheme ?? 'light'].text }]}> {rating} ({reviewCount})</Text>
        </View>

        <Text style={[styles.productPrice, { color: Colors[colorScheme ?? 'light'].text }]}>${product.price.toFixed(2)}</Text>
      </View>
=======
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
                    backgroundColor: pressed ? themeColors.primary + 'E6' : themeColors.primary,
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
                <Ionicons name={quantity === 1 ? 'trash-outline' : 'remove'} size={18} color={themeColors.primary} />
            </Pressable>
            <Text style={[styles.quantityText, { color: themeColors.text }]}>{quantity}</Text>
            <Pressable onPress={incrementQuantity} style={styles.controlButton}>
                <Ionicons name="add" size={18} color={themeColors.primary} />
            </Pressable>
            </View>
        )}
>>>>>>> test-fix
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    // marginHorizontal: 8, // Handled by parent container gap
  },
  imageContainer: {
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderRadius: 16,
  },
  image: {
    width: '80%',
    height: '80%',
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 4,
    paddingVertical: 4,
     shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  controlButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 4,
  },
  content: {
    marginTop: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.6,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pressed: {
<<<<<<< HEAD
    opacity: 0.9,
  }
=======
    opacity: 0.8,
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 1,
    padding: 4,
  },
>>>>>>> test-fix
});
