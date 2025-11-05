"use client";
import { motion } from "framer-motion";

export default function OrderCard({ order }) {
  return (
    <motion.div
      className="p-4 bg-white shadow-sm rounded-2xl border border-gray-200 hover:shadow-md transition-all"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-lg">{order.customer_name}</h3>
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            order.status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : order.status === "ready"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {order.status}
        </span>
      </div>
      <ul className="text-sm text-gray-700 mb-2">
        {order.items?.map((item, i) => (
          <li key={i}>• {item}</li>
        ))}
      </ul>
      <p className="text-xs text-gray-500">
        Tidspunkt: {new Date(order.created_at).toLocaleTimeString("da-DK")}
      </p>
    </motion.div>
  );
}
