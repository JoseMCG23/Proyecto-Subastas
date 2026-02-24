import Header from "./Header";
import { Footer } from "./Footer";
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      {}
      <main className="flex-1 pt-20 pb-20 bg-white text-neutral-900">
        <div className="max-w-7xl mx-auto px-6">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}
