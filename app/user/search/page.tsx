"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/Applayout";

export default function UserSearchPage() {
  const router = useRouter();
  const [userIdInput, setUserIdInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userIdInput.trim()) return;

    setLoading(true);
    setErrorMessage("");

    try {
      // ユーザーが存在するか確認するためのAPIリクエスト
      const res = await fetch(`http://localhost:8000/api/v1/users`);
      if (!res.ok) throw new Error("Failed to get user data.");

      const users = await res.json();
      const targetId = Number(userIdInput.trim());

      // 入力された user_id が存在するか完全一致で検索
      const found = users.find((u: { user_id: number }) => u.user_id === targetId);

      if (found) {
        router.push(`/user/${targetId}/all`);
      } else {
        setErrorMessage(`ID: ${targetId} Not Found`);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to connect server");
      setLoading(false);
    }
  };

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Home", href: "/home" },
        { label: "Players", href: "/user" },
        { label: "Search", href: "/user/search" },
      ]}
    >
      <div className="max-w-md mx-auto mt-10 bg-teal-300 p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
        <h2 className="text-lg font-bold text-gray-800">INFINITAS ID Search</h2>
        
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              INFINITAS ID (Exact Match)
            </label>
            <input
              type="number"
              value={userIdInput}
              onChange={(e) => setUserIdInput(e.target.value)}
              placeholder="123456789012"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {errorMessage && (
            <p className="text-xs text-red-600 font-medium">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md text-sm transition disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search & Go"}
          </button>
        </form>
      </div>
    </AppLayout>
  );
}