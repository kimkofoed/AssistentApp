"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import MenuItem from "@/components/MenuItem";

export default function MenuPage() {
  const [menu, setMenu] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("menu").select("*");
      setMenu(data || []);
      setLoading(false);
    };

    load(); // ✅ Kald funktionen – vi returnerer ikke noget!
  }, []);

  if (loading) return <p className="p-6">Indlæser…</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Menu</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menu?.map((item) => (
          <MenuItem key={item.uid} item={item} />
        ))}
      </div>
    </div>
  );
}
