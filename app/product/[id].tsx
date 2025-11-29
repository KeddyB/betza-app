import { View, Text, StyleSheet, Image, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router'; // Import Stack
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types';
import { useTheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useCart } from '@/app/context/CartContext';
import { useToast } from '@/app/context/ToastContext';
import { Ionicons } from '@expo/vector-icons';

function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { colorScheme } = useTheme();
  const { cart, addToCart, removeFromCart, updateCartQuantity } = useCart();
  const { showToast } = useToast();
  const [addingToCart, setAddingToCart] = useState(false);

  // Get current quantity from cart
  const currentQuantity = cart.find(item => item.id === product?.id)?.quantity || 0;
  const [quantity, setQuantity] = useState(currentQuantity);

  useEffect(() => {
    setQuantity(currentQuantity);
  }, [currentQuantity]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching product details:', error);
      } else {
        setProduct(data);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      setAddingToCart(true);
      setTimeout(() => {
        addToCart(product, 1); // Add 1 to cart
        showToast(`${product.name} added to cart!`, 'success');
        setAddingToCart(false);
      }, 500);
    }
  };

  const incrementQuantity = () => {
    if (product) {
      updateCartQuantity(product.id, quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (product) {
      if (quantity === 1) {
        removeFromCart(product.id);
        showToast(`${product.name} removed from cart!`, 'info');
      } else if (quantity > 1) {
        updateCartQuantity(product.id, quantity - 1);
      }
    }
  };

  if (loading) {
    return (
      <View style={[styles.loaderContainer, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <Text style={{ color: Colors[colorScheme ?? 'light'].text }}>Product not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <Image source={{ uri: product.image_url }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={[styles.name, { color: Colors[colorScheme ?? 'light'].text }]}>{product.name}</Text>
        <Text style={[styles.price, { color: Colors[colorScheme ?? 'light'].primary }]}>₦{product.price.toFixed(2)}</Text>
        <Text style={[styles.description, { color: Colors[colorScheme ?? 'light'].text }]}>{product.description || 'No description available.'}</Text>
        
        {quantity === 0 ? (
          <Pressable 
            style={({ pressed }) => [styles.addButton, { backgroundColor: Colors[colorScheme ?? 'light'].primary }, pressed && styles.pressed]}
            onPress={handleAddToCart}
            disabled={addingToCart}
          >
            {addingToCart ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.addButtonText}>Add to Cart</Text>
            )}
          </Pressable>
        ) : (
          <View style={[styles.quantitySelectorContainer, { backgroundColor: Colors[colorScheme ?? 'light'].inputBackground }]}>
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
    </ScrollView>
  );
}

export default function ProductDetailPage() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ProductDetailScreen />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  detailsContainer: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  addButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantitySelectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    paddingVertical: 6,
    marginTop: 20,
  },
  quantityButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantityText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pressed: {
    opacity: 0.7,
  }
});
