import { View, Text, StyleSheet, FlatList, Image, Button } from 'react-native';
import { useCart } from '../context/CartContext';
import { useTheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function CartPage() {
  const { cart, clearCart } = useCart();
  const { colorScheme } = useTheme();

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>My Cart</Text>
      {cart.length > 0 ? (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={[styles.cartItem, { backgroundColor: Colors[colorScheme ?? 'light'].card }]}>
                <Image source={{ uri: item.image_url }} style={styles.image} />
                <View style={styles.itemInfo}>
                  <Text style={[styles.itemName, { color: Colors[colorScheme ?? 'light'].text }]}>{item.name}</Text>
                  <Text style={[styles.itemPrice, { color: Colors[colorScheme ?? 'light'].primary }]}>₦{item.price.toFixed(2)}</Text>
                  <Text style={[styles.itemQuantity, { color: Colors[colorScheme ?? 'light'].text }]}>Quantity: {item.quantity}</Text>
                </View>
              </View>
            )}
          />
          <View style={[styles.totalContainer, { borderTopColor: Colors[colorScheme ?? 'light'].border }]}>
            <Text style={[styles.totalText, { color: Colors[colorScheme ?? 'light'].text }]}>Total: ₦{totalPrice.toFixed(2)}</Text>
            <Button title="Checkout" onPress={() => { /* Checkout logic here */ }} color={Colors[colorScheme ?? 'light'].primary} />
            <Button title="Clear Cart" onPress={clearCart} color={Colors[colorScheme ?? 'light'].notification} />
          </View>
        </>
      ) : (
        <Text style={[styles.emptyText, { color: Colors[colorScheme ?? 'light'].text }]}>Your cart is empty.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  cartItem: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 14,
    marginVertical: 4,
  },
  itemQuantity: {
    fontSize: 14,
  },
  totalContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 12,
  },
});
