"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import OrderCard from "@/components/OrderCard";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      setOrders(data || []);
      setLoading(false);
    };

    load(); // ✅ Ikke returnere, kun kalde

    // ✅ Realtime subscription (må gerne returnere cleanup)
    const channel = supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        async () => {
          const { data } = await supabase
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false });

          setOrders(data || []);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel); // ✅ Rigtig cleanup
    };
  }, []);

  if (loading) return <p className="p-6">Indlæser…</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Ordrer</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.length > 0 ? (
          orders.map((order) => <OrderCard key={order.uid} order={order} />)
        ) : (
          <p className="text-gray-500">Ingen ordrer endnu.</p>
        )}
      </div>
    </div>
  );
}
