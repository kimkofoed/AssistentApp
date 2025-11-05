"use client";

import { motion } from "framer-motion";

interface OrderCardProps {
  order: {
    uid: string;
    customer_name?: string | null;
    phone?: string | null;
    items?: any[] | null;
    total_price?: number | null;
    created_at: string;
  };
}

export default function OrderCard({ order }: OrderCardProps) {
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
          <p className="text-xl font-bold">{order.total_price || 0} kr</p>
        </div>
      </div>
    </motion.div>
  );
}
