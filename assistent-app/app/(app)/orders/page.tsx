"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import OrderCard from "@/components/OrderCard";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    const { data, error } = await supabase
    .from("orders")
    .select(`
        id,
        customer_name,
        created_at,
        status,
        order_items!order_items_order_id_fkey (
        qty,
        price,
        menu!order_items_menu_id_fkey (
            name
        )
        )
    `)
    .order("created_at", { ascending: false });

    if (error) {
      console.error(
        "❌ Supabase fejl:",
        error.message,
        error.details,
        error.hint
      );
      setLoading(false);
      return;
    }

    console.log("✅ Supabase data:", data);
    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();

    const ordersChannel = supabase
      .channel("orders-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => loadOrders()
      )
      .subscribe();

    const itemsChannel = supabase
      .channel("order-items-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "order_items" },
        () => loadOrders()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(itemsChannel);
    };
  }, []);

  if (loading) return <p className="p-6 text-gray-600">Indlæser ordrer…</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Ordrer</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.length > 0 ? (
          orders.map((order) => <OrderCard key={order.id} order={order} />)
        ) : (
          <p className="text-gray-500">Ingen ordrer endnu.</p>
        )}
      </div>
    </div>
  );
}
