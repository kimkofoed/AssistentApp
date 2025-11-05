"use client";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import MobileNav from "@/components/MobileNav";

export default function AppShell({ children }) {
  return (
    <div className="flex min-h-screen">
    <Sidebar />
    <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-6 max-w-6xl mx-auto w-full">{children}</main>
        <MobileNav />
    </div>
    </div>
  );
}