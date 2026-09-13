import Link from "next/link";
import AppLayout from "@/components/Applayout";

export default function Home() {
  return (
        <AppLayout
          breadcrumbs={[
            { label: "Home", href: "/home" }
          ]}
        >
        <main className="p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">IIDX IRT Dashboard</h1>
        <p className="text-gray-600 mb-8">
            統計学の手法を取り入れたIIDX INFINITASプラットフォームへようこそ。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <a href="https://x.com/analabnet"
             className="block p-6 bg-teal-300 shadow rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition"
            >
            <h2 className="text-xl font-semibold mb-2 text-blue-600">Contact</h2>
            <p className="text-gray-500 text-sm flex items-center space-x-2">
                <span>X:</span>
                <span>analabnet</span>
            </p>
            </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="block p-6 bg-teal-300 shadow rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition">
            <h2 className="text-xl font-semibold mb-2 text-blue-600">Updated History</h2>
            <p className="text-gray-500 text-sm">
              INFINITAS OFFICIAL LASTUPDATE : YYYY/MM/DD
            </p>
          </div>
        </div>
        </main>
    </AppLayout>
  );
}