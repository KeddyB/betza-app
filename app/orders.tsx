<<<<<<< HEAD
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
=======
import { Text, StyleSheet } from 'react-native';
import React from 'react';
>>>>>>> test-fix
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { useAuth } from './context/AuthContext';
import OrderSkeleton from '@/components/OrderSkeleton';
import { useRouter } from 'expo-router';

export default function OrdersScreen() {
  const { colorScheme } = useTheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('id, created_at, total, order_items(quantity, products(name, price))')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  return (
<<<<<<< HEAD
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.title, { color: themeColors.text }]}>My Orders</Text>
      {loading ? (
        <View>
            {[...Array(3)].map((_, i) => <OrderSkeleton key={i} />)}
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={{color: themeColors.text}}>You have no orders.</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => router.push(`/order/${item.id}`)} style={[styles.orderCard, { backgroundColor: themeColors.card }]}>
              <View style={styles.orderHeader}>
                <Text style={[styles.orderId, { color: themeColors.text }]}>Order #{item.id.slice(0, 8)}</Text>
                <Text style={[styles.orderDate, { color: themeColors.text + '99' }]}>{new Date(item.created_at).toLocaleDateString()}</Text>
              </View>
              {item.order_items.map((orderItem: any) => (
                <View key={orderItem.products.name} style={styles.itemContainer}>
                    <Text style={{color: themeColors.text}}>{orderItem.products?.name || 'Product not found'} (x{orderItem.quantity || 0})</Text>
                    <Text style={{color: themeColors.primary}}>₦{((orderItem.products?.price || 0) * (orderItem.quantity || 0)).toFixed(2)}</Text>
                </View>
              ))}
               <View style={styles.totalContainer}>
                <Text style={[styles.totalText, { color: themeColors.text }]}>Total: ₦{(item.total || 0).toFixed(2)}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
=======
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Orders</Text>
      <Text>This is where the user&apos;s order history will be displayed.</Text>
>>>>>>> test-fix
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    orderCard: {
        marginBottom: 16,
        borderRadius: 12,
        padding: 16,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
        borderBottomWidth: 1,
        paddingBottom: 8,
        borderBottomColor: Colors.light.border, // Use a fixed color or from theme
    },
    orderId: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    orderDate: {
        fontSize: 14,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 4,
    },
    totalContainer: {
        marginTop: 12,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: Colors.light.border,
        alignItems: 'flex-end',
    },
    totalText: {
        fontSize: 16,
        fontWeight: 'bold',
    }
});
