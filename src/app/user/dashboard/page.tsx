import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard | AMKO" };

export default function DashboardPage() {
  return (
    <div className="p-4">
      <h1 className="mb-2 text-[2rem] font-bold">Dashboard</h1>
      <p className="text-slate-500">Welcome to your dashboard!</p>
    </div>
  );
}
