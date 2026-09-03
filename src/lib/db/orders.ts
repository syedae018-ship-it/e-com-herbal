import { supabase, isSupabaseConfigured } from '../supabase/client';
import { Order, OrderItem, OrderStatus } from '../types';
import { generateOrderNumber } from '../utils';

// Local store for fallback / offline orders preview
let localOrders: Order[] = [
  {
    id: 'ord-sample-1',
    user_id: null,
    order_number: 'HL-2026-1082',
    customer_name: 'Priya Sharma',
    customer_email: 'priya.sharma@example.com',
    customer_phone: '+91 98765 43210',
    status: 'delivered',
    payment_method: 'cod',
    payment_status: 'paid',
    subtotal: 948,
    shipping_amount: 0,
    total_amount: 948,
    shipping_address: {
      fullName: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '+91 98765 43210',
      street: '42 Lotus Boulevard, 4th Floor',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560001',
    },
    items: [
      {
        id: 'item-1',
        product_name: 'Neem & Tulsi Herbal Soap',
        product_price: 149,
        quantity: 2,
        image_url: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'item-2',
        product_name: 'Aloe Vera Gentle Face Wash',
        product_price: 249,
        quantity: 1,
        image_url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80',
      },
    ],
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

/**
 * Places a customer order in Supabase.
 * Attempts to execute create_order_secure RPC to calculate prices and deduct stock in database;
 * falls back gracefully to standard table inserts if the RPC function has not been registered.
 */
export async function createOrder(
  orderInput: Omit<Order, 'id' | 'order_number' | 'created_at'>,
  items: OrderItem[]
): Promise<{ success: boolean; order?: Order; error?: string }> {
  const orderNumber = generateOrderNumber();

  if (!isSupabaseConfigured() || !supabase) {
    const newOrder: Order = {
      ...orderInput,
      id: `ord-${Date.now()}`,
      order_number: orderNumber,
      items: items.map((item, idx) => ({ ...item, id: `item-${Date.now()}-${idx}` })),
      created_at: new Date().toISOString(),
    };
    localOrders.unshift(newOrder);
    return { success: true, order: newOrder };
  }

  try {
    // Attempt RPC call first
    const rpcPayload = {
      p_user_id: orderInput.user_id || null,
      p_customer_name: orderInput.customer_name,
      p_customer_email: orderInput.customer_email,
      p_customer_phone: orderInput.customer_phone,
      p_shipping_address: orderInput.shipping_address,
      p_items: items.map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
      p_order_number: orderNumber,
    };

    const { data: rpcData, error: rpcError } = await supabase.rpc('create_order_secure', rpcPayload);

    if (!rpcError && rpcData?.success) {
      return {
        success: true,
        order: {
          ...orderInput,
          id: rpcData.order_id,
          order_number: rpcData.order_number,
          total_amount: rpcData.total_amount,
          items,
          created_at: new Date().toISOString(),
        },
      };
    }

    // Direct insert fallback
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: orderInput.user_id || null,
        order_number: orderNumber,
        customer_name: orderInput.customer_name,
        customer_email: orderInput.customer_email,
        customer_phone: orderInput.customer_phone,
        status: orderInput.status || 'pending',
        payment_method: orderInput.payment_method || 'cod',
        payment_status: orderInput.payment_status || 'pending',
        subtotal: orderInput.subtotal,
        shipping_amount: orderInput.shipping_amount,
        total_amount: orderInput.total_amount,
        shipping_address: orderInput.shipping_address,
      })
      .select()
      .single();

    if (orderError || !orderData) {
      return { success: false, error: orderError?.message || 'Failed to place order' };
    }

    // Insert order items
    const itemInserts = items.map((item) => ({
      order_id: orderData.id,
      product_id: item.product_id || null,
      product_name: item.product_name,
      product_price: item.product_price,
      quantity: item.quantity,
      image_url: item.image_url || null,
    }));

    await supabase.from('order_items').insert(itemInserts);

    return {
      success: true,
      order: {
        ...orderData,
        items,
      },
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Retrieves all orders for the Admin Portal.
 */
export async function getOrders(): Promise<Order[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return [...localOrders];
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.warn('Falling back to local orders:', error?.message);
      return [...localOrders];
    }

    return data as Order[];
  } catch (err) {
    console.error('Error fetching orders from Supabase:', err);
    return [...localOrders];
  }
}

/**
 * Retrieves orders placed by a specific logged-in customer.
 */
export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return localOrders.filter((o) => o.user_id === userId || !o.user_id);
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data) {
      return [];
    }

    return data as Order[];
  } catch (err) {
    console.error('Error fetching customer orders from Supabase:', err);
    return [];
  }
}

/**
 * Retrieves order details by unique order number (e.g. for receipt page).
 */
export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  if (!isSupabaseConfigured() || !supabase) {
    return localOrders.find((o) => o.order_number === orderNumber) || null;
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .eq('order_number', orderNumber)
      .single();

    if (error || !data) {
      return localOrders.find((o) => o.order_number === orderNumber) || null;
    }

    return data as Order;
  } catch (err) {
    console.error('Error fetching order by number from Supabase:', err);
    return localOrders.find((o) => o.order_number === orderNumber) || null;
  }
}

/**
 * Updates an order status (Admin only).
 */
export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    const order = localOrders.find((o) => o.id === orderId);
    if (order) {
      order.status = status;
      order.updated_at = new Date().toISOString();
      return { success: true };
    }
    return { success: false, error: 'Order not found' };
  }

  try {
    const { error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
