"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import OrderCard from "@/components/OrderCard";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      setOrders(data || []);
    };
    load();

    const ch = supabase
      .channel("orders-rt")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => load()
      )
      .subscribe();

    return () => supabase.removeChannel(ch);
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Ordrer</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.length ? (
          orders.map((o) => <OrderCard key={o.id} order={o} />)
        ) : (
          <p className="text-gray-500">Ingen ordrer endnu.</p>
        )}
      </div>
    </>
  );
}
