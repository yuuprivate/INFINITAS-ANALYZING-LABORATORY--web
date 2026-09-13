"use client";

import Link from "next/link";
import { useState } from "react";
import LeftSidebar from "./LeftSideBar";
import RightSidebar from "./RightSideBar";

type BreadcrumbItem = {
  label: string;
  href: string;
};

type AppLayoutProps = {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
};

export default function AppLayout({
  children,
  breadcrumbs,
}: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-teal-200 text-gray-900">

      {/* =========================
          Header
      ========================= */}
      <header className="bg-gray-900 border-b border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">

          <div className="flex items-center justify-between">

            <h1 className="text-lg sm:text-xl lg:text-2xl font-black tracking-wider text-blue-300">
              IIDX INFINITAS ANALYZING LAB.
            </h1>

            {/* モバイル用メニューボタン */}
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-md text-gray-200 hover:bg-gray-700"
              aria-label="メニュー"
              aria-expanded={sidebarOpen}
            >
              {sidebarOpen ? "✕" : "☰"}
            </button>

          </div>
        </div>
      </header>


      {/* =========================
          Mobile Sidebar
      ========================= */}
      {sidebarOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 shadow-sm">
          <LeftSidebar
            mobile
            onNavigate={() => setSidebarOpen(false)}
          />
        </div>
      )}


      {/* =========================
          Main Layout
      ========================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">

        <div className="flex gap-6 items-start">

          {/* PC Left Sidebar */}
          <div className="hidden lg:block">
            <LeftSidebar />
          </div>


          {/* Main Content */}
          <main className="min-w-0 flex-1">

            {/* Breadcrumb */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <div className="mb-4 text-sm text-gray-500">
                <ol className="flex items-center gap-2 flex-wrap">

                  {breadcrumbs.map((item, index) => {
                    const isLast =
                      index === breadcrumbs.length - 1;

                    return (
                      <li
                        key={item.href}
                        className="flex items-center gap-2"
                      >
                        {index > 0 && <span>/</span>}

                        {isLast ? (
                          <span className="text-gray-800 font-medium">
                            {item.label}
                          </span>
                        ) : (
                          <Link
                            href={item.href}
                            className="text-blue-600 hover:underline"
                          >
                            {item.label}
                          </Link>
                        )}
                      </li>
                    );
                  })}

                </ol>
              </div>
            )}

            {children}

          </main>


          {/* PC Right Sidebar */}
          <div className="hidden lg:block">
            <RightSidebar />
          </div>

        </div>
      </div>
    </div>
  );
}