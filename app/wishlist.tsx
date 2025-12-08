import { View, Text, StyleSheet, FlatList } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useWishlist } from './context/WishlistContext';
import ProductCard from '@/components/ProductCard';
import { useRouter } from 'expo-router';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';

export default function WishlistScreen() {
  const { colorScheme } = useTheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const { wishlist, loading } = useWishlist();
  const router = useRouter();

  const renderSkeletons = () => (
    <View style={styles.listContainer}>
      {[...Array(8)].map((_, index) => <ProductCardSkeleton key={index} />)}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.title, { color: themeColors.text }]}>My Wishlist</Text>
      {loading ? (
        renderSkeletons()
      ) : wishlist.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={{ color: themeColors.text }}>Your wishlist is empty.</Text>
        </View>
      ) : (
        <FlatList
          data={wishlist}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ProductCard product={item} onPress={() => router.push(`/product/${item.id}`)} />
          )}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={{ justifyContent: 'space-between' }} // Add this for consistent spacing
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 24,
        paddingHorizontal: 8, // Adjust for alignment with the grid
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer: {
        paddingBottom: 16,
    },
});
