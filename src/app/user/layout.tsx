import type { ReactNode } from "react";
import Link from "next/link";

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-[220px] bg-[#233d4d] p-4 text-white">
        <h1 className="mb-4 text-center text-[1.4em] font-bold">Amko</h1>
        <nav>
          <Link href="/user/dashboard" className="text-white no-underline">
            Dashboard
          </Link>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
    </div>
  );
}
