<<<<<<< HEAD
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
=======
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
>>>>>>> test-fix
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import { useTheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
<<<<<<< HEAD
import ProductCardSkeleton from '@/components/ProductCardSkeleton';
=======

const { width } = Dimensions.get('window');
const productWidth = (width - 48) / 2;

const ProductCardSkeleton = () => {
    const { colorScheme } = useTheme();
    const themeColors = Colors[colorScheme ?? 'light'];
    return (
        <View style={[styles.skeletonProductCard, { backgroundColor: themeColors.card, width: productWidth }]}>
            <View style={[styles.skeletonImage, { backgroundColor: themeColors.background }]} />
            <View style={[styles.skeletonText, { height: 12, width: '80%', marginTop: 8, backgroundColor: themeColors.background }]} />
            <View style={[styles.skeletonText, { height: 10, width: '50%', marginTop: 4, backgroundColor: themeColors.background }]} />
            <View style={[styles.skeletonButton, { backgroundColor: themeColors.background }]} />
        </View>
    );
};

const SearchSkeleton = () => (
    <View style={styles.skeletonContainer}>
        {[...Array(6)].map((_, i) => <ProductCardSkeleton key={i} />)}
    </View>
);
>>>>>>> test-fix

export default function SearchScreen() {
  const { q } = useLocalSearchParams();
  const { colorScheme } = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD
=======
  const router = useRouter();
  const { colorScheme } = useTheme();
>>>>>>> test-fix
  const themeColors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    const fetchProducts = async () => {
<<<<<<< HEAD
      if (!q) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .textSearch('name', q as string, { type: 'websearch' });

        if (error) {
          console.error('Error fetching products:', error);
        } else {
          setProducts(data);
        }
      } finally {
=======
      if (typeof q !== 'string' || q.length < 2) { // Changed to 2 for better UX
        setProducts([]);
>>>>>>> test-fix
        setLoading(false);
      }
<<<<<<< HEAD
=======

      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .ilike('name', `%${q}%`);

      if (error) {
        console.error('Error fetching search results:', error);
      } else {
        setProducts(data);
      }
      setLoading(false);
>>>>>>> test-fix
    };

    const searchTimeout = setTimeout(() => {
        fetchProducts();
    }, 300); // Debounce search input

    return () => clearTimeout(searchTimeout);
  }, [q]);

<<<<<<< HEAD
  const renderSkeletons = () => (
    <View style={styles.listContainer}>
        <View style={styles.columnWrapper}>
            {[...Array(8)].map((_, index) => <ProductCardSkeleton key={index} />)}
        </View>
    </View>
=======
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.title, { color: themeColors.text }]}>Results for &quot;{q}&quot;</Text>
      {loading ? (
        <SearchSkeleton />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => router.push(`/product/${item.id}`)}
            />
          )}
          columnWrapperStyle={styles.listContainer}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: themeColors.text }]}>No products found.</Text>
                <Text style={[styles.emptySubText, { color: themeColors.text + '99' }]}>Try searching for something else.</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
>>>>>>> test-fix
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
        <Text style={[styles.title, { color: themeColors.text }]}>Search results for "{q}"</Text>

        {loading ? (
            renderSkeletons()
        ) : (
            <FlatList
            data={products}
            numColumns={2}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <ProductCard product={item} onPress={() => {}} />
            )}
            contentContainerStyle={styles.listContainer}
            columnWrapperStyle={styles.columnWrapper}
            />
        )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
<<<<<<< HEAD
    marginBottom: 16,
    paddingTop: 20,
=======
    paddingTop: 16,
    marginBottom: 24,
>>>>>>> test-fix
  },
  listContainer: {
    paddingBottom: 16,
  },
<<<<<<< HEAD
  columnWrapper: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    flexWrap: 'wrap',
=======
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
>>>>>>> test-fix
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptySubText: {
    fontSize: 14,
    marginTop: 8,
  },
  // Skeleton Styles
  skeletonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  skeletonProductCard: {
      marginBottom: 16,
      borderRadius: 12,
      padding: 10,
  },
  skeletonImage: {
      height: 120,
      borderRadius: 8,
  },
  skeletonText: {
      borderRadius: 4,
  },
  skeletonButton: {
      height: 40,
      borderRadius: 8,
      marginTop: 12,
  }
});
