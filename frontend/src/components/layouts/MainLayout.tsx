import type { ReactNode } from "react";
import TopBar from "./TopBar";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <TopBar />
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
