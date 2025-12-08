import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import { useTheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';

export default function SearchScreen() {
  const { q } = useLocalSearchParams();
  const { colorScheme } = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const themeColors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    const fetchProducts = async () => {
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
        setLoading(false);
      }
    };

    fetchProducts();
  }, [q]);

  const renderSkeletons = () => (
    <View style={styles.listContainer}>
        <View style={styles.columnWrapper}>
            {[...Array(8)].map((_, index) => <ProductCardSkeleton key={index} />)}
        </View>
    </View>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingTop: 20,
  },
  listContainer: {
    paddingBottom: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
