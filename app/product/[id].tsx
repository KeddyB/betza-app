import { View, Text, StyleSheet, Image, ScrollView, Pressable, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
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
  const { cart, addToCart } = useCart();
  const { showToast } = useToast();
  const [addingToCart, setAddingToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<'Description' | 'Review'>('Description');

  // Get current quantity from cart
  const currentQuantity = cart.find(item => item.id === product?.id)?.quantity || 1; // Default to 1 for selection
  const [quantity, setQuantity] = useState(currentQuantity);

  useEffect(() => {
    // If item is in cart, sync quantity. If not, default to 1 for the selector.
    const inCartQty = cart.find(item => item.id === product?.id)?.quantity;
    if (inCartQty) {
        setQuantity(inCartQty);
    }
  }, [cart, product]);

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
        addToCart(product, quantity); // Add current selected quantity
        showToast(`${product.name} added to cart!`, 'success');
        setAddingToCart(false);
      }, 300);
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
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

  // Mock data
  const rating = product.rating || 4.8;
  const reviewCount = product.review_count || 198;

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        {/* Custom Header */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={[styles.iconButton, { backgroundColor: Colors[colorScheme ?? 'light'].card }]}>
                <Ionicons name="arrow-back" size={24} color={Colors[colorScheme ?? 'light'].text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: Colors[colorScheme ?? 'light'].text }]}>Product Details</Text>
            <TouchableOpacity onPress={() => router.push('/cart')} style={[styles.iconButton, { backgroundColor: Colors[colorScheme ?? 'light'].card }]}>
                 <Ionicons name="bag-outline" size={24} color={Colors[colorScheme ?? 'light'].text} />
            </TouchableOpacity>
        </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
             <Image source={{ uri: product.image_url }} style={styles.image} resizeMode="contain" />
             {/* 360 Indicator - Cosmetic */}
             <View style={styles.rotateIndicator}>
                 <Ionicons name="code-working" size={20} color={Colors.light.primary} />
             </View>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.titleRow}>
              <Text style={[styles.name, { color: Colors[colorScheme ?? 'light'].text }]}>{product.name}</Text>
              <View>
                  <Text style={[styles.priceLabel, { color: Colors[colorScheme ?? 'light'].text + '80' }]}>Price</Text>
                  <Text style={[styles.price, { color: Colors[colorScheme ?? 'light'].text }]}>₦{product.price.toFixed(2)}</Text>
              </View>
          </View>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color="#FFC107" />
            <Text style={[styles.ratingText, { color: Colors[colorScheme ?? 'light'].text }]}> {rating} ({reviewCount} review)</Text>
          </View>

          {/* Tabs */}
          <View style={styles.tabContainer}>
              <Pressable onPress={() => setActiveTab('Description')} style={[styles.tab, activeTab === 'Description' && styles.activeTab, activeTab === 'Description' && { backgroundColor: Colors.light.primary }]}>
                  <Text style={[styles.tabText, activeTab === 'Description' ? styles.activeTabText : { color: Colors[colorScheme ?? 'light'].text }]}>Description</Text>
              </Pressable>
              <Pressable onPress={() => setActiveTab('Review')} style={[styles.tab, activeTab === 'Review' && styles.activeTab, activeTab === 'Review' && { backgroundColor: Colors.light.primary }]}>
                  <Text style={[styles.tabText, activeTab === 'Review' ? styles.activeTabText : { color: Colors[colorScheme ?? 'light'].text }]}>Review</Text>
              </Pressable>
          </View>

          <Text style={[styles.description, { color: Colors[colorScheme ?? 'light'].text + 'AA' }]}>
            {product.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'}
            <Text style={{ fontWeight: 'bold', color: Colors[colorScheme ?? 'light'].text }}> See more</Text>
          </Text>

          {/* Color/Variant Selection - Mock */}
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>Color</Text>
          <View style={styles.variantContainer}>
              {['#D1D5DB', '#FECACA', '#BFDBFE', '#A7F3D0'].map((color, index) => (
                  <View key={index} style={[styles.variantCircle, { backgroundColor: color, borderColor: index === 1 ? Colors.light.primary : 'transparent', borderWidth: index === 1 ? 2 : 0 }]} />
              ))}
          </View>

        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={[styles.bottomBar, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
          <View style={[styles.quantitySelector, { backgroundColor: Colors[colorScheme ?? 'light'].card }]}>
               <TouchableOpacity onPress={decrementQuantity} style={styles.qtyBtn}>
                   <Ionicons name="remove" size={20} color={Colors.light.primary} />
               </TouchableOpacity>
               <Text style={[styles.qtyText, { color: Colors[colorScheme ?? 'light'].text }]}>{quantity} kg</Text>
               <TouchableOpacity onPress={incrementQuantity} style={styles.qtyBtn}>
                   <Ionicons name="add" size={20} color={Colors.light.primary} />
               </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.addToCartButton, { backgroundColor: Colors.light.primary }]}
            onPress={handleAddToCart}
            disabled={addingToCart}
          >
             {addingToCart ? (
                <ActivityIndicator color="#fff" />
             ) : (
                <>
                    <Ionicons name="bag-handle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.addToCartText}>Add to cart</Text>
                </>
             )}
          </TouchableOpacity>
      </View>
    </View>
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
  header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 50, // Status bar
      paddingHorizontal: 20,
      paddingBottom: 10,
  },
  headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
  },
  iconButton: {
      padding: 8,
      borderRadius: 12,
  },
  scrollContent: {
      paddingBottom: 100,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginTop: 20,
  },
  image: {
    width: '80%',
    height: '80%',
  },
  rotateIndicator: {
      position: 'absolute',
      bottom: 0,
      padding: 8,
      borderRadius: 20,
  },
  detailsContainer: {
    padding: 24,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20, // Overlap slightly if background differs
  },
  titleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 16,
  },
  priceLabel: {
      fontSize: 12,
      textAlign: 'right',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
  },
  ratingText: {
      fontSize: 14,
      marginLeft: 4,
  },
  tabContainer: {
      flexDirection: 'row',
      marginBottom: 16,
  },
  tab: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
      borderRadius: 12,
  },
  activeTab: {},
  tabText: {
      fontSize: 16,
      fontWeight: '600',
  },
  activeTabText: {
      color: '#fff',
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 24,
  },
  sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 12,
  },
  variantContainer: {
      flexDirection: 'row',
      gap: 16,
  },
  variantCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
  },
  bottomBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      padding: 24,
      alignItems: 'center',
      justifyContent: 'space-between',
      borderTopWidth: 1,
  },
  quantitySelector: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 16,
      padding: 6,
      width: '40%',
      justifyContent: 'space-between',
  },
  qtyBtn: {
      width: 36,
      height: 36,
      borderRadius: 12,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
  },
  qtyText: {
      fontWeight: 'bold',
      fontSize: 16,
  },
  addToCartButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      borderRadius: 16,
      width: '55%',
  },
  addToCartText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
  },
});
