"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function MenuItem({ item }) {
  const [status, setStatus] = useState(item.status);

  const toggleSoldOut = async () => {
    const newStatus = status === "ok" ? "sold_out" : "ok";
    setStatus(newStatus);

    const { error } = await supabase
      .from("menu")
      .update({ status: newStatus })
      .eq("id", item.id);

    if (error) {
      console.error(error);
      // rollback UI hvis fejl
      setStatus(status);
      alert("Kunne ikke opdatere status.");
    }
  };

  const isSoldOut = status === "sold_out";

  return (
    <div
      className={`p-4 border rounded-xl shadow-sm transition ${
        isSoldOut ? "bg-red-50 border-red-300" : "bg-white"
      }`}
    >
      {/* Pizza nummer */}
      <p className="text-sm font-medium text-gray-500 mb-1">
        #{item.number}
      </p>

      {/* Navn + pris */}
      <h3
        className={`text-lg font-semibold ${
          isSoldOut ? "line-through text-gray-400" : "text-gray-900"
        }`}
      >
        {item.name}
      </h3>

      <p className="text-gray-600 text-sm mb-3">{item.price} kr</p>

      {/* Udsolgt toggle knap */}
      <button
        onClick={toggleSoldOut}
        className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
          isSoldOut
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-red-600 text-white hover:bg-red-700"
        }`}
      >
        {isSoldOut ? "Gør tilgængelig" : "Markér udsolgt"}
      </button>
    </div>
  );
}
