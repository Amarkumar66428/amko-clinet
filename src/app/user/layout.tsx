import Link from "next/link";

export default function UserLayout({ children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: 220, background: "#233d4d", color: "#fff", padding: "1rem" }}>
        <h1 style={{ textAlign: "center", fontSize: "1.4em", marginBottom: "1rem" }}>Amko</h1>
        <nav>
          <Link href="/user/dashboard" style={{ color: "#fff", textDecoration: "none" }}>
            Dashboard
          </Link>
        </nav>
      </aside>
      <main style={{ flex: 1, background: "#f9fafb", overflow: "auto" }}>{children}</main>
    </div>
  );
}
