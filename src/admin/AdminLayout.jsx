import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar.jsx";

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-ivory flex">
      <AdminSidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex-1 min-w-0">
        <div className="lg:hidden sticky top-0 z-30 bg-pitch text-ivory px-4 h-14 flex items-center justify-between">
          <span className="font-display font-bold">Manager</span>
          <button onClick={() => setOpen(true)} aria-label="Open menu">☰</button>
        </div>
        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
