"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Sun, Moon, User } from "lucide-react";

const RESTAURANT_ID = "11111111-1111-1111-1111-111111111111";

export default function Topbar() {
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load restaurant data
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("restaurants")
        .select("*")
        .eq("id", RESTAURANT_ID)
        .single();

      setRestaurant(data);
      setLoading(false);
    };

    load();
  }, []);

  const toggleOpenStatus = async () => {
    if (!restaurant) return;

    await supabase
      .from("restaurants")
      .update({ is_open: !restaurant.is_open })
      .eq("id", RESTAURANT_ID);

    setRestaurant({ ...restaurant, is_open: !restaurant.is_open });
  };

  if (loading) return null;

  return (
    <div
      className="
        w-full 
        bg-white
        border-b
        shadow-sm 
        px-4 py-3 
        flex items-center justify-between
      "
    >
      {/* LEFT SIDE */}
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-lg font-semibold">
            {restaurant?.name}
          </h1>

          <p
            className={`text-sm ${
              restaurant?.is_open
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {restaurant?.is_open ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3">
        {/* Toggle restaurant open/closed */}
        <button
          onClick={toggleOpenStatus}
          className={`
            px-4 py-2 rounded-xl text-sm font-medium transition
            ${
              restaurant?.is_open
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }
          `}
        >
          {restaurant?.is_open ? "Luk for i dag" : "Åbn igen"}
        </button>

        {/* Profile menu placeholder */}
        <div
          className="
            w-10 h-10 rounded-full 
            bg-gray-200
            flex items-center justify-center 
            text-gray-600
          "
        >
          <User size={20} />
        </div>
      </div>
    </div>
  );
}
