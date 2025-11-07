"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface MenuItemProps {
  item: {
    uid: string;
    number: number;
    name: string;
    price: number;
    status: string; // "ok" | "sold_out"
  };
}

export default function MenuItem({ item }: MenuItemProps) {
  const [status, setStatus] = useState(item.status);

  const toggleSoldOut = async () => {
    const newStatus = status === "ok" ? "sold_out" : "ok";

    await supabase
      .from("menu")
      .update({ status: newStatus })
      .eq("id", item.uid);

    setStatus(newStatus);
  };

  return (
    <div
      className={`p-4 border rounded-xl shadow-sm bg-white ${
        status === "sold_out" ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold">
            #{item.number} – {item.name}
          </p>
          <p className="text-gray-600">{item.price} kr</p>
        </div>

        <button
          onClick={toggleSoldOut}
          className={`px-3 py-1 rounded-lg text-sm font-medium ${
            status === "sold_out"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status === "sold_out" ? "Gør tilgængelig" : "Udsolgt"}
        </button>
      </div>
    </div>
  );
}
