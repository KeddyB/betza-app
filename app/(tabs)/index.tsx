import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Pressable, RefreshControl, Dimensions, FlatList } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Product, Category } from '@/lib/types'; // Import Category
import ProductCard from '@/components/ProductCard';
import SkeletonLoader from '@/components/SkeletonLoader';
import { useTheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';
import CategorySkeleton from '@/components/CategorySkeleton';

interface GroupedProducts {
  [key: string]: Product[];
}

export default function HomePage() {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const [groupedProducts, setGroupedProducts] = useState<GroupedProducts>({});
  const [categories, setCategories] = useState<Category[]>([]); // Changed to Category[]
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHomeData = async () => {
    try {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*');

      if (categoriesError) {
        console.error('Error fetching categories:', JSON.stringify(categoriesError, null, 2));
      }
      setCategories(categoriesData || []);

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

  useEffect(() => {
    setLoading(true);
    fetchHomeData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchHomeData();
    setRefreshing(false);
  }, []);

  const renderProductSkeletons = () => (
    <View style={styles.productsGrid}>
      {[...Array(4)].map((_, index) => <ProductCardSkeleton key={index} />)}
    </View>
  );

  const renderCategorySkeletons = () => (
    <View style={styles.categoriesContainer}>
        {[...Array(5)].map((_, index) => <CategorySkeleton key={index} />)}
    </View>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.bannerContainer}>
          <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>Up to 30% offer</Text>
              <Text style={styles.bannerSubtitle}>Enjoy our big offer</Text>
              <Pressable style={styles.shopNowButton}>
                  <Text style={styles.shopNowText}>Shop Now</Text>
              </Pressable>
          </View>
          <Image
              source={{ uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' }}
              style={styles.bannerImage}
              resizeMode="cover"
          />
      </View>

      {loading && !refreshing ? (
          <View style={styles.categoriesContainer}>
              {[...Array(5)].map((_, index) => <CategorySkeleton key={index} />)}
          </View>
      ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          {categories.map((category) => (
              <TouchableOpacity key={category.id} style={styles.categoryItem} onPress={() => router.push(`/category/${category.name}`)}>
                  <View style={styles.categoryIconCircle}>
                  <Image
                      source={{ uri: category.icon || 'https://cdn-icons-png.flaticon.com/512/3082/3082025.png' }}
                      style={styles.categoryImage}
                  />
                  </View>
                  <Text style={[styles.categoryName, { color: Colors[colorScheme ?? 'light'].text }]}>{category.name}</Text>
              </TouchableOpacity>
          ))}
          </ScrollView>
      )}

      {loading && !refreshing ? (
        <View style={{ paddingHorizontal: 16 }}>{renderProductSkeletons()}</View>
      ) : (
        <View style={styles.productsGrid}>
          {Object.keys(groupedProducts)
            .slice(0, 1) // Only show one category for featured products
            .map((categoryName) =>
              groupedProducts[categoryName]
                .slice(0, 2) // Only show 2 products for featured
                .map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onPress={() => router.push(`/product/${product.id}`)}
                  />
                ))
            )}
        </View>
      )}

    {/* Category Carousels */}
    {!loading &&
      Object.keys(groupedProducts).map((categoryName) => (
        <View key={categoryName} style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>{categoryName}</Text>
            <TouchableOpacity onPress={() => router.push(`/category/${categoryName}`)}>
              <Ionicons name="chevron-forward" size={24} color={Colors[colorScheme ?? 'light'].text} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={groupedProducts[categoryName].slice(0, 5)}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            decelerationRate="fast"
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                onPress={() => router.push(`/product/${item.id}`)}
                carouselMode
              />
            )}
          />
        </View>
      ))}
  </ScrollView>
);
}

const { width } = Dimensions.get('window');
const productGridItemWidth = (width - 60) / 2; // (Total width - padding - gap) / 2
const categoryItemWidth = width / 5; // 5 categories per row approx

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    // Background color will be set dynamically
  },
  bannerContainer: {
    backgroundColor: '#D1FAE5',
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
    color: '#064E3B',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
    marginBottom: 16,
  },
  shopNowButton: {
    backgroundColor: '#10B981',
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
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
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
    flexDirection: 'row',
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  categoryIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
  },
  bannerDiscount: {
    fontSize: 24,
    fontWeight: '600',
    // Color will be set dynamically
  },
  bannerOffer: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 4,
    // Color will be set dynamically
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
    fontWeight: '600',
    textTransform: 'capitalize',
    // Color will be set dynamically
  },
  categoriesWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start', // Adjust from space-between to flex-start
    gap: 8, // Added gap for spacing between items
  },
  categoryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 12,
    textAlign: 'center',
    // Color will be set dynamically
  },
  productsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
});
