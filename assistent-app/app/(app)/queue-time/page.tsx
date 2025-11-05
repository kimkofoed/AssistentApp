"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const RESTAURANT_ID = "11111111-1111-1111-1111-111111111111";

export default function QueueTimePage() {
  const [queueTime, setQueueTime] = useState<number>(15);
  const times = [0, 10, 15, 20, 25, 30, 40, 50, 60];

  useEffect(() => {
    const load = async () => {
        const { data } = await supabase
            .from("restaurant_status")
            .select("*")
            .eq("restaurant_id", RESTAURANT_ID)
            .single();

        setQueueTime(data.wait_time);
    };

    load();
  }, []);

  const updateQueue = async (time: number) => {
    setQueueTime(time);

    await supabase
    .from("restaurant_status")
    .update({ wait_time: time })
    .eq("restaurant_id", RESTAURANT_ID);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Ventetid</h1>

      <p className="text-gray-600">
        Nuværende ventetid: <strong>{queueTime} min</strong>
      </p>

      <div className="grid grid-cols-3 gap-4">
        {times.map((t) => (
          <button
            key={t}
            onClick={() => updateQueue(t)}
            className={`
              py-4 rounded-xl text-lg font-medium
              border 
              ${queueTime === t ? "bg-blue-600 text-white" : "bg-white"}
            `}
          >
            {t} min
          </button>
        ))}
      </div>
    </div>
  );
}
