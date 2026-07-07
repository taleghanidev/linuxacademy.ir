import { UserButton } from "@clerk/nextjs";
import type { ReactNode } from "react";
import AdminMobileNav from "@/components/admin/MobileNav";
import AdminSidebar from "@/components/admin/Sidebar";
import adminFa from "@/language/fa/admin";
import { assertAdminPage } from "@/lib/admin";

export const dynamic = "force-dynamic";
export const metadata = { title: "پنل مدیریت — لینوکس آکادمی" };

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await assertAdminPage();

  return (
    <div dir="rtl" lang="fa" className="flex min-h-screen bg-gray-50/80 text-gray-900">
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="lg:hidden">
              <div className="text-sm font-bold">{adminFa.brand}</div>
              <div className="text-xs text-gray-400">{adminFa.brandSub}</div>
            </div>
            <div className="ms-auto">
              <UserButton />
            </div>
          </div>
          <AdminMobileNav />
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 px-4 py-6">{children}</main>
      </div>
    </div>
  );
}
