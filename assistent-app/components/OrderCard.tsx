"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { CheckCircle, Clock, Loader, Package } from "lucide-react";

interface OrderModifier {
  name: string;
  price?: number;
  type?: "addon" | "remove";
}

interface OrderItem {
  qty: number;
  price: number;
  comment?: string | null;
  menu?: {
    name: string;
    number?: number;
  };
  modifiers?: OrderModifier[] | null; // 👈 nyt felt til tilbehør
}

interface OrderCardProps {
  order: {
    id: string;
    customer_name?: string | null;
    created_at: string;
    status?: string;
    order_items?: OrderItem[] | null;
  };
}

export default function OrderCard({ order }: OrderCardProps) {
  const [status, setStatus] = useState(order.status || "afventer");
  const [loading, setLoading] = useState(false);

  // ✅ Beregn totalpris inkl. modifiers
  const total =
    order.order_items?.reduce((sum, item) => {
      const base = (item.price ?? 0) * (item.qty ?? 1);
      const addons =
        item.modifiers?.reduce(
          (aSum, mod) => aSum + (mod.price ?? 0),
          0
        ) ?? 0;
      return sum + base + addons;
    }, 0) ?? 0;

  // ✅ Status flow
  const nextStatus = (s: string) =>
    s === "afventer"
      ? "igang"
      : s === "igang"
      ? "klar"
      : s === "klar"
      ? "afsluttet"
      : "afventer";

  // ✅ Opdater status i Supabase
  const updateStatus = async () => {
    const newStatus = nextStatus(status);
    setLoading(true);
    await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", order.id);
    setStatus(newStatus);
    setLoading(false);
  };

  // ✅ Statusfarver og ikoner
  const statusStyles: Record<string, string> = {
    afventer: "bg-gray-100 text-gray-800",
    igang: "bg-yellow-100 text-yellow-800",
    klar: "bg-green-100 text-green-800",
    afsluttet: "bg-gray-200 text-gray-500",
  };

  const statusIcons: Record<string, any> = {
    afventer: Clock,
    igang: Loader,
    klar: CheckCircle,
    afsluttet: Package,
  };

  const Icon = statusIcons[status] || Clock;

  return (
    <div
      className={`p-5 bg-white rounded-2xl border-2 shadow-sm
        ${
          status === "klar"
            ? "border-green-500"
            : status === "igang"
            ? "border-yellow-400"
            : status === "afventer"
            ? "border-gray-300"
            : "border-gray-200"
        }`}
    >
      {/* Kundeinfo */}
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-xl">
            {order.customer_name || "Ukendt kunde"}
          </p>
          <p className="text-gray-600 text-sm">
            Bestilt: {new Date(order.created_at).toLocaleTimeString("da-DK")}
          </p>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold">{total} kr</p>
          <div
            className={`mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status]}`}
          >
            <Icon size={16} /> {status}
          </div>
        </div>
      </div>

      {/* Produkter */}
      <div className="mt-4 bg-gray-50 rounded-xl p-3">
        {order.order_items && order.order_items.length > 0 ? (
          <ul className="space-y-2">
            {order.order_items.map((item, i) => (
              <li key={i} className="text-lg font-medium">
                <div className="flex justify-between">
                <span>
                  #{item.menu?.number ?? "?"} – {item.menu?.name || "Ukendt produkt"}
                </span>
                  <span>{item.price} kr</span>
                </div>

                {/* Kommentar (gratis ændringer) */}
                {item.comment && (
                  <p className="text-sm text-gray-600 italic ml-4">
                    💬 {item.comment}
                  </p>
                )}

                {/* Tilbehør / modifiers */}
                {item.modifiers && item.modifiers.length > 0 && (
                  <ul className="ml-6 mt-1 space-y-1 text-sm text-gray-700">
                    {item.modifiers.map((mod, j) => (
                      <li key={j} className="flex justify-between">
                        <span>
                          {mod.type === "remove" ? "➖" : "➕"} {mod.name}
                        </span>
                        {mod.price && mod.price > 0 && (
                          <span>{mod.price} kr</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">Ingen produkter i ordren</p>
        )}
      </div>

      {/* Status-knap */}
      {status !== "afsluttet" && (
        <button
          onClick={updateStatus}
          disabled={loading}
          className={`mt-5 w-full py-3 rounded-xl text-white text-lg font-semibold
            transition ${
              status === "afventer"
                ? "bg-yellow-500 hover:bg-yellow-600"
                : status === "igang"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 hover:bg-gray-500"
            }`}
        >
          {loading
            ? "Opdaterer..."
            : status === "afventer"
            ? "Start ordre"
            : status === "igang"
            ? "Markér som klar"
            : "Afslut ordre"}
        </button>
      )}
    </div>
  );
}