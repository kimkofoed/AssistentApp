"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Pizza, ClipboardList, Timer } from "lucide-react";

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/orders", label: "Ordrer", icon: ClipboardList },
    { href: "/menu", label: "Menu", icon: Pizza },
    { href: "/queue-time", label: "Ventetid", icon: Timer },
  ];

  return (
    <div className="
      fixed bottom-0 left-0 right-0 
      bg-white border-t shadow-lg
      flex justify-around
      py-3
      md:hidden
      z-50
    ">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center text-xs"
          >
            <Icon
              size={22}
              className={active ? "text-green-600" : "text-gray-500"}
            />
            <span className={active ? "text-green-700" : "text-gray-500"}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
