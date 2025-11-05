"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Pizza, ClipboardList, Settings, Timer } from "lucide-react";

const NavLink = ({ href, label, icon: Icon }: any) => {
  const pathname = usePathname();
  const active = pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-xl transition
        ${active ? "bg-gray-900 text-white" : "hover:bg-gray-100 text-gray-800"}
      `}
    >
      <Icon size={18} />
      <span className="font-medium">{label}</span>
    </Link>
  );
};

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 border-r bg-white p-4 hidden md:block">
      
      {/* Branding */}
      <div className="flex items-center gap-2 mb-6">
        <Pizza className="text-gray-900" />
        <span className="font-bold">Pizza Assistant</span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">

        <NavLink href="/orders" label="Ordrer" icon={ClipboardList} />
        <NavLink href="/menu" label="Menu" icon={Pizza} />

        {/* NEW: Ventetid */}
        <NavLink href="/queue-time" label="Ventetid" icon={Timer} />

        <div className="mt-4 pt-4 border-t">
          <NavLink href="/settings" label="Indstillinger" icon={Settings} />
        </div>
      </nav>
    </aside>
  );
}
