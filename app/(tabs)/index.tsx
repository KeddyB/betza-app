import { View, Text, FlatList, Image, StyleSheet, Dimensions, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Product, Category } from '@/lib/types'; // Import Category
import ProductCard from '@/components/ProductCard';
import SkeletonLoader from '@/components/SkeletonLoader';
import { useTheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

interface GroupedProducts {
  [key: string]: Product[];
}

export default function HomePage() {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const [groupedProducts, setGroupedProducts] = useState<GroupedProducts>({});
  const [categories, setCategories] = useState<Category[]>([]); // Changed to Category[]
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
          return;
        }
        setCategories(categoriesData || []);

        // Fetch products and group them
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*'); // Removed limit to fetch all for client-side grouping

        if (productsError) {
          console.error('Error fetching products:', JSON.stringify(productsError, null, 2));
          return;
        }

        const grouped = productsData.reduce((acc: GroupedProducts, product: Product) => {
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
    <ScrollView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]} showsVerticalScrollIndicator={false}>
      {/* Discount Banner */}
      <View style={[styles.bannerContainer, { backgroundColor: Colors[colorScheme ?? 'light'].card }]}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=200&fit=crop' }}
          style={styles.bannerImage}
        />
        <View style={styles.bannerOverlay}>
          <Text style={[styles.bannerDiscount, { color: Colors[colorScheme ?? 'light'].text }]}>20% off on your</Text>
          <Text style={[styles.bannerOffer, { color: Colors[colorScheme ?? 'light'].primary }]}>first purchase</Text>
        </View>
      </View>

      {/* Categories Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>Categories</Text>
          <TouchableOpacity onPress={() => router.push('/categories')}>
            <Ionicons name="chevron-forward" size={24} color={Colors[colorScheme ?? 'light'].text} />
          </TouchableOpacity>
        </View>

        <View style={styles.categoriesWrapper}>
          {loading ? (
            <ActivityIndicator size="small" color={Colors[colorScheme ?? 'light'].tint} />
          ) : (
            categories.map((categoryItem) => {
              const iconName = categoryItem.icon || 'pricetags'; // Default icon
              const iconColor = categoryItem.color || Colors[colorScheme ?? 'light'].tint; // Default color
              return (
                <TouchableOpacity
                  key={categoryItem.id}
                  style={styles.categoryItem}
                  onPress={() => router.push(`/category/${categoryItem.name}`)}
                >
                  <View style={[styles.categoryIconContainer, { backgroundColor: iconColor }]}>
                    <Ionicons name={iconName as any} size={28} color="#fff" />
                  </View>
                  <Text style={[styles.categoryName, { color: Colors[colorScheme ?? 'light'].text }]}>{categoryItem.name}</Text>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </View>

      {/* Featured Products Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>Featured products</Text>
          <TouchableOpacity onPress={() => router.push('/products')}>
            <Ionicons name="chevron-forward" size={24} color={Colors[colorScheme ?? 'light'].text} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.skeletonContainer}>
            <SkeletonLoader />
            <SkeletonLoader />
          </View>
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
      </View>

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
  container: {
    flex: 1,
    // Background color will be set dynamically
  },
  bannerContainer: {
    position: 'relative',
    height: 150,
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 12,
    overflow: 'hidden',
    // Background color will be set dynamically
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    left: 16,
    top: '50%',
    transform: [{ translateY: -30 }],
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
  categoryItem: {
    width: categoryItemWidth - 8, // Adjusted width for gap
    alignItems: 'center',
    marginBottom: 16,
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
    gap: 12,
  },
  skeletonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
});
