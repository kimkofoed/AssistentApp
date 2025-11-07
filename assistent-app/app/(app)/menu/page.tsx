"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function MenuPage() {
  const [menu, setMenu] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMenu = async () => {
    const { data, error } = await supabase
      .from("menu")
      .select(`
        id,
        number,
        name,
        price,
        status,
        ingredients:menu_ingredients!menu_ingredients_menu_id_fkey (
          ingredient:ingredients!menu_ingredients_ingredient_id_fkey ( name )
        )
      `)
      .order("number", { ascending: true });

    if (error) console.error("❌ Supabase fejl:", error);
    setMenu(data || []);
    setLoading(false);
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "sold_out" ? "ok" : "sold_out";
    await supabase.from("menu").update({ status: newStatus }).eq("id", id);
    setMenu((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  };

  useEffect(() => {
    loadMenu();
  }, []);

  if (loading) return <p className="p-6">Indlæser menu…</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Menu</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menu.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleStatus(item.id, item.status)}
            className={`p-4 rounded-xl border shadow-sm bg-white cursor-pointer transition ${
              item.status === "sold_out"
                ? "opacity-60 border-red-300"
                : "hover:border-green-400"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-lg">
                  #{item.number} – {item.name}
                </p>
                <p className="text-gray-600">{item.price} kr</p>
                {item.ingredients && item.ingredients.length > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    {item.ingredients
                      .map((ing: any) => ing.ingredient?.name)
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
              </div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  item.status === "sold_out"
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {item.status === "sold_out" ? "Udsolgt" : "Tilgængelig"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
