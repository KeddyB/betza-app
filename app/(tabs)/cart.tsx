import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { useCart } from '../context/CartContext';
import { useTheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function CartScreen() {
  const { cart, updateCartQuantity, removeFromCart } = useCart();
  const { colorScheme } = useTheme();
  const router = useRouter();

  const incrementQuantity = (itemId: number, currentQuantity: number) => {
    updateCartQuantity(itemId, currentQuantity + 1);
  };

  const decrementQuantity = (itemId: number, currentQuantity: number) => {
    if (currentQuantity === 1) {
      removeFromCart(itemId);
    } else {
      updateCartQuantity(itemId, currentQuantity - 1);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={Colors[colorScheme ?? 'light'].text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: Colors[colorScheme ?? 'light'].text }]}>Cart</Text>
        <TouchableOpacity>
             <Text style={[styles.ordersText, { color: Colors[colorScheme ?? 'light'].text }]}>Orders</Text>
        </TouchableOpacity>
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyCartContainer}>
          <Ionicons name="cart-outline" size={64} color={Colors[colorScheme ?? 'light'].text + '80'} />
          <Text style={[styles.emptyCartText, { color: Colors[colorScheme ?? 'light'].text }]}>Your cart is empty</Text>
          <TouchableOpacity style={styles.startShoppingButton} onPress={() => router.push('/(tabs)')}>
            <Text style={styles.startShoppingText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <View style={[styles.cartItem, { backgroundColor: '#F9FAFB' }]}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: item.image_url }} style={styles.itemImage} resizeMode="contain" />
                </View>

                <View style={styles.itemDetails}>
                  <Text style={[styles.itemName, { color: Colors[colorScheme ?? 'light'].text }]} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={[styles.itemPrice, { color: Colors[colorScheme ?? 'light'].text }]}>
                    ${item.price.toFixed(2)}
                  </Text>
                </View>

                <View style={styles.quantityControl}>
                    <Pressable onPress={() => decrementQuantity(item.id, item.quantity)} style={styles.controlButton}>
                         <Ionicons name="trash-outline" size={16} color="#000" />
                    </Pressable>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <Pressable onPress={() => incrementQuantity(item.id, item.quantity)} style={styles.controlButton}>
                        <Ionicons name="add" size={16} color="#000" />
                    </Pressable>
                </View>
              </View>
            )}
          />

          <View style={[styles.footer, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
            {/* Can add Subtotal / Tax row here if needed */}
            <TouchableOpacity style={styles.checkoutButton}>
              <Text style={styles.checkoutButtonText}>Go to checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  ordersText: {
      fontSize: 14,
      fontWeight: '500',
  },
  listContent: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
  },
  imageContainer: {
      width: 60,
      height: 60,
      backgroundColor: '#fff',
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
  },
  itemImage: {
    width: 50,
    height: 50,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  controlButton: {
      padding: 4,
  },
  quantityText: {
      marginHorizontal: 8,
      fontWeight: '600',
      fontSize: 14,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  checkoutButton: {
    backgroundColor: '#00C569', // Green checkout button
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
  },
  startShoppingButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#00C569',
    borderRadius: 8,
  },
  startShoppingText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
