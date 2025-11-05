"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import MenuItem from "@/components/MenuItem";

export default function MenuPage() {
  const [menu, setMenu] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("menu")
        .select("*")
        .order("number", { ascending: true });
      setMenu(data || []);
    };
    load();

    const ch = supabase
      .channel("menu-rt")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "menu" },
        () => load()
      )
      .subscribe();

    return () => supabase.removeChannel(ch);
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Menu</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {menu.length ? (
          menu.map((m) => <MenuItem key={m.id} item={m} />)
        ) : (
          <p className="text-gray-500">Ingen menupunkter fundet.</p>
        )}
      </div>
    </>
  );
}
