"use client";

import { motion } from "framer-motion";

interface OrderItem {
  name?: string;
  number?: number;
  qty: number;
  price: number;
}

interface OrderCardProps {
  order: {
    id: string;
    customer_name?: string | null;
    phone?: string | null;
    items?: OrderItem[] | null;
    created_at: string;
  };
}

export default function OrderCard({ order }: OrderCardProps) {
  // ✅ Beregn totalpris ud fra items
  const total =
    order.items?.reduce((sum, item) => {
      const qty = item.qty ?? 1;
      const price = item.price ?? 0;
      return sum + qty * price;
    }, 0) ?? 0;

  return (
    <motion.div
      className="p-4 bg-white shadow-sm rounded-2xl border border-gray-200 hover:shadow-md transition-all"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-lg">
            {order.customer_name || "Ukendt kunde"}
          </p>

          <p className="text-gray-600 text-sm">
            Bestilt: {new Date(order.created_at).toLocaleTimeString("da-DK")}
          </p>

          <p className="text-gray-800 mt-2 font-medium">
            {order.items?.length || 0} x produkter
          </p>
        </div>

        <div className="text-right">
          <p className="text-xl font-bold">{total} kr</p>
        </div>
      </div>
    </motion.div>
  );
}
