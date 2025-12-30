import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import TopBar from "./TopBar";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      <TopBar />
      {isHome ? (
        <main className="w-full">{children}</main>
      ) : (
        <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
      )}
    </div>
  );
}
