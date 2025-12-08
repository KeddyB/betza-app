import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Pressable, ActivityIndicator } from 'react-native';
import { useCart } from '../context/CartContext';
import { useTheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { supabase } from '@/lib/supabase';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { useState } from 'react';

WebBrowser.maybeCompleteAuthSession();

export default function CartScreen() {
  const { cart, updateCartQuantity, removeFromCart } = useCart();
  const { colorScheme } = useTheme();
  const router = useRouter();
  const themeColors = Colors[colorScheme ?? 'light'];
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const verifyPayment = async (reference: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("verify-payment", {
        body: { reference },
      });

      if (error) throw new Error(error.message);

      cart.length = 0;
      alert("Payment successful! Your order has been placed.");
      router.replace(`/order/${data.order_id}`);
    } catch (err: any) {
      alert(err.message || "Failed to verify payment.");
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      router.push('/auth/get-started');
      return;
    }

    setIsProcessing(true);

    try {
      const redirectUrl = Linking.createURL('payment-callback');

      const { data, error } = await supabase.functions.invoke('initialize-payment', {
        body: {
          amount: cartTotal,
          email: user.email,
          metadata: {
            user_id: user.id,
            cart_items: cart.map(item => ({
              product_id: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
          },
          redirect_url: redirectUrl
        },
      });

      if (error) throw new Error(error.message);
      if (!data.authorization_url) throw new Error("Unable to initialize payment.");

      const result = await WebBrowser.openAuthSessionAsync(
        data.authorization_url,
        redirectUrl
      );

      if (result.type === "success" && result.url) {
        const { queryParams } = Linking.parse(result.url);
        const reference = queryParams?.reference || queryParams?.trxref;

        if (reference) {
          await verifyPayment(reference as string);
        } else {
          alert("Payment reference missing.");
        }
      }
    } catch (err: any) {
      alert(err.message || "Something went wrong.");
    } finally {
      setIsProcessing(false);
    }
  };

  const incrementQuantity = (itemId: string, currentQuantity: number) => {
    updateCartQuantity(itemId, currentQuantity + 1);
  };

  const decrementQuantity = (itemId: string, currentQuantity: number) => {
    updateCartQuantity(itemId, currentQuantity - 1);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={[styles.header, { borderBottomColor: themeColors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={themeColors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.text }]}>Cart</Text>
        <TouchableOpacity onPress={() => router.push('/orders')}>
          <Text style={[styles.ordersText, { color: themeColors.text }]}>Orders</Text>
        </TouchableOpacity>
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyCartContainer}>
          <Ionicons name="cart-outline" size={64} color={themeColors.text + '80'} />
          <Text style={[styles.emptyCartText, { color: themeColors.text }]}>Your cart is empty</Text>

          <TouchableOpacity
            style={[styles.startShoppingButton, { backgroundColor: themeColors.primary }]}
            onPress={() => router.push('/(tabs)')}
          >
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
              <View style={[styles.cartItem, { backgroundColor: themeColors.card }]}>
                <View style={styles.imageContainer}>
                  <Image source={{ uri: item.image_url }} style={styles.itemImage} resizeMode="contain" />
                </View>

                <View style={styles.itemDetails}>
                  <Text style={[styles.itemName, { color: themeColors.text }]} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={[styles.itemPrice, { color: themeColors.primary }]}>
                    ₦{item.price.toFixed(2)}
                  </Text>
                </View>

                <View style={styles.quantityContainer}>
                  <View style={[styles.quantityControl, { backgroundColor: themeColors.background, borderColor: themeColors.border }]}>
                    <Pressable onPress={() => decrementQuantity(item.id, item.quantity)} style={styles.controlButton}>
                      <Ionicons name="remove" size={16} color={themeColors.text} />
                    </Pressable>
                    <Text style={[styles.quantityText, { color: themeColors.text }]}>{item.quantity}</Text>
                    <Pressable onPress={() => incrementQuantity(item.id, item.quantity)} style={styles.controlButton}>
                      <Ionicons name="add" size={16} color={themeColors.text} />
                    </Pressable>
                  </View>
                  <Pressable onPress={() => removeFromCart(item.id)} style={styles.deleteButton}>
                    <Ionicons name="trash-outline" size={20} color={themeColors.notification} />
                  </Pressable>
                </View>
              </View>
            )}
          />

          <View style={[styles.footer, { backgroundColor: themeColors.background, borderTopColor: themeColors.border }]}>
            <View style={styles.totalContainer}>
              <Text style={[styles.totalLabel, { color: themeColors.text }]}>Total</Text>
              <Text style={[styles.totalAmount, { color: themeColors.text }]}>₦{cartTotal.toFixed(2)}</Text>
            </View>

            <TouchableOpacity
              style={[styles.checkoutButton, { backgroundColor: themeColors.primary, opacity: isProcessing ? 0.6 : 1 }]}
              onPress={handleCheckout}
              disabled={isProcessing}
            >
              {isProcessing ? <ActivityIndicator color="#fff" /> : <Text style={styles.checkoutButtonText}>Go to checkout</Text>}
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    paddingTop: 20,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  ordersText: { fontSize: 14, fontWeight: '500' },
  listContent: { padding: 16 },
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
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemImage: { width: 50, height: 50 },
  itemDetails: { flex: 1, justifyContent: 'center' },
  itemName: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  itemPrice: { fontSize: 14, fontWeight: 'bold' },
  quantityContainer: { flexDirection: 'column', alignItems: 'flex-end', gap: 8 },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
  },
  controlButton: { padding: 4 },
  quantityText: { marginHorizontal: 8, fontWeight: '600', fontSize: 14 },
  deleteButton: { padding: 4 },
  footer: { padding: 20, borderTopWidth: 1 },
  totalContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  totalLabel: { fontSize: 16, fontWeight: '500' },
  totalAmount: { fontSize: 18, fontWeight: 'bold' },
  checkoutButton: { paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  checkoutButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  emptyCartContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyCartText: { marginTop: 16, fontSize: 18, fontWeight: '600' },
  startShoppingButton: { marginTop: 20, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  startShoppingText: { color: '#fff', fontWeight: 'bold' },
});
