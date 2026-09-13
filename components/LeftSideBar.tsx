"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type LeftSidebarProps = {
  mobile?: boolean;
  onNavigate?: () => void;
};

export default function LeftSidebar({
  mobile = false,
  onNavigate,
}: LeftSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/home", label: "Home" },
    { href: "/user", label: "Player" },
    { href: "/song", label: "Song" },
  ];

  return (
    <aside
      className={
        mobile
          ? "w-full bg-white p-4"
          : "w-52 shrink-0 bg-white rounded-lg shadow-sm p-4 h-fit"
      }
    >
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`px-4 py-3 rounded-md text-sm font-medium transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}