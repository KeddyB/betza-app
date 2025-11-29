import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Pressable } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Product, Category } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import { useTheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

interface GroupedProducts {
  [key: string]: Product[];
}

export default function HomePage() {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const [groupedProducts, setGroupedProducts] = useState<GroupedProducts>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        // Fetch categories first
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*');

        if (categoriesError) {
          console.error('Error fetching categories:', JSON.stringify(categoriesError, null, 2));
        }
        setCategories(categoriesData || []);

        // Fetch products and group them
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*');

        if (productsError) {
          console.error('Error fetching products:', JSON.stringify(productsError, null, 2));
        }

        const grouped = (productsData || []).reduce((acc: GroupedProducts, product: Product) => {
          const categoryName = categoriesData?.find(cat => cat.id === product.category_id)?.name || 'Uncategorized';
          if (!acc[categoryName]) {
            acc[categoryName] = [];
          }
          acc[categoryName].push(product);
          return acc;
        }, {});
        setGroupedProducts(grouped);

      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <View style={[styles.mainContainer, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      {/* Custom Header */}
      <View style={[styles.header, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <View style={styles.locationContainer}>
            <Ionicons name="bicycle-outline" size={24} color={Colors[colorScheme ?? 'light'].text} />
            <View style={styles.locationTextContainer}>
                <Text style={[styles.locationText, { color: Colors[colorScheme ?? 'light'].text }]}>61 Hopper street..</Text>
                <Ionicons name="chevron-down" size={16} color={Colors[colorScheme ?? 'light'].text} />
            </View>
        </View>
        <TouchableOpacity onPress={() => router.push('/cart')}>
            <Ionicons name="bag-outline" size={24} color={Colors[colorScheme ?? 'light'].text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Promotional Banner */}
        <View style={styles.bannerContainer}>
            <View style={styles.bannerContent}>
                <Text style={styles.bannerTitle}>Up to 30% offer</Text>
                <Text style={styles.bannerSubtitle}>Enjoy our big offer</Text>
                <Pressable style={styles.shopNowButton}>
                    <Text style={styles.shopNowText}>Shop Now</Text>
                </Pressable>
            </View>
            <Image
                source={{ uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' }} // Fresh produce basket image
                style={styles.bannerImage}
                resizeMode="cover"
            />
        </View>

        {/* Circular Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          {loading ? (
             <ActivityIndicator size="small" color={Colors[colorScheme ?? 'light'].tint} />
          ) : (
             categories.map((category) => (
                <TouchableOpacity key={category.id} style={styles.categoryItem} onPress={() => router.push(`/category/${category.name}`)}>
                   <View style={styles.categoryIconCircle}>
                      <Image
                        source={{ uri: category.icon || 'https://cdn-icons-png.flaticon.com/512/3082/3082025.png' }} // Fallback or use real icons if available
                        style={styles.categoryImage}
                      />
                   </View>
                   <Text style={[styles.categoryName, { color: Colors[colorScheme ?? 'light'].text }]}>{category.name}</Text>
                </TouchableOpacity>
             ))
          )}
        </ScrollView>

        {/* Product Sections */}
        {loading ? (
           <View style={{ padding: 16 }}>
             <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
           </View>
        ) : (
           Object.keys(groupedProducts).map((categoryName) => (
             <View key={categoryName} style={styles.sectionContainer}>
               <View style={styles.sectionHeader}>
                 <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>{categoryName}</Text>
                 <TouchableOpacity onPress={() => router.push(`/category/${categoryName}`)}>
                   <Text style={{ color: Colors[colorScheme ?? 'light'].primary, fontWeight: '600' }}>See all</Text>
                 </TouchableOpacity>
               </View>

               <View style={styles.productsGrid}>
                 {groupedProducts[categoryName].slice(0, 4).map((product) => (
                   <ProductCard
                     key={product.id}
                     product={product}
                     onPress={() => router.push(`/product/${product.id}`)}
                   />
                 ))}
               </View>
             </View>
           ))
        )}
         <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingTop: 50, // Adjust for status bar
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
  },
  container: {
    flex: 1,
  },
  bannerContainer: {
    backgroundColor: '#D1FAE5', // Light green background
    margin: 16,
    borderRadius: 16,
    height: 160,
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
  },
  bannerContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    zIndex: 1,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#064E3B', // Dark green
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#10B981', // Green
    fontWeight: '600',
    marginBottom: 16,
  },
  shopNowButton: {
    backgroundColor: '#10B981', // Green button
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  shopNowText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  bannerImage: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  categoryIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3F4F6', // Light gray
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryImage: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '500',
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
