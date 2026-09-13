"use client";

import Applayout from "@/components/Applayout";

import { useEffect, useState } from "react";
import Link from "next/link";

type User = {
  user_id: number;
  dj_name: string;
  ability_clear_sp?: number;
  ability_score_sp?: number;
  ability_clear_dp?: number;
  ability_score_dp?: number;
};

// ソート可能なキーに動的アビリティ項目も含める
type SortKey = "user_id" | "dj_name" | "clear" | "score";

export default function User() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [sortKey, setSortKey] = useState<SortKey>("user_id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [playStyle, setPlayStyle] = useState<"SP" | "DP">("SP");

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/users")
      .then((res) => {
        if (!res.ok) {
          throw new Error("データの取得に失敗しました");
        }
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  // ユーザーオブジェクトからソート対象の値を取り出すヘルパー
  const getSortValue = (user: User, key: SortKey) => {
    if (key === "clear") {
      return playStyle === "SP" ? user.ability_clear_sp : user.ability_clear_dp;
    }
    if (key === "score") {
      return playStyle === "SP" ? user.ability_score_sp : user.ability_score_dp;
    }
    return user[key as keyof User];
  };

  const sortedUsers = [...users].sort((a, b) => {
    const aVal = getSortValue(a, sortKey);
    const bVal = getSortValue(b, sortKey);

    if (aVal === undefined || aVal === null) return 1;
    if (bVal === undefined || bVal === null) return -1;

    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortOrder === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    return sortOrder === "asc"
      ? (aVal as number) - (bVal as number)
      : (bVal as number) - (aVal as number);
  });

  const renderSortIndicator = (key: SortKey) => {
    if (sortKey !== key) return <span className="text-gray-500 ml-1">↕</span>;
    return <span className="text-blue-600 ml-1">{sortOrder === "asc" ? "▲" : "▼"}</span>;
  };

  return (
    <Applayout
      breadcrumbs={[
        { label: "Home", href: "/home" },
        { label: "Players", href: "/users" },
      ]}
    >
      <div className="w-full space-y-3">

        {/* 1. テーブル上部コントロール（右上にプルダウンを配置） */}
        <div className="flex justify-between items-center px-1">
          <h2 className="text-base font-bold text-gray-800">Player List</h2>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-gray-600">Style:</span>
            <select
              value={playStyle}
              onChange={(e) => setPlayStyle(e.target.value as "SP" | "DP")}
              className="border border-gray-300 rounded-md bg-white text-gray-900 text-xs px-2.5 py-1 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="SP">SP</option>
              <option value="DP">DP</option>
            </select>
          </div>
        </div>

        {loading && (
          <p className="p-8 text-center text-gray-500">Loading...</p>
        )}

        {error && (
          <p className="p-8 text-center text-red-500">Error occured : {error}</p>
        )}

        {!loading && !error && (
          <div className="shadow rounded-lg overflow-x-auto border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-teal-400">
                <tr>
                  <th onClick={() => handleSort("user_id")}>
                    ID {renderSortIndicator("user_id")}
                  </th>
                  <th onClick={() => handleSort("dj_name")}>
                    DJ NAME {renderSortIndicator("dj_name")}
                  </th>
                  <th onClick={() => handleSort("clear")}>
                    {playStyle} Clear ability {renderSortIndicator("clear")}
                  </th>
                  <th onClick={() => handleSort("score")}>
                    {playStyle} Score ability {renderSortIndicator("score")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-teal-300 divide-y divide-gray-200">
                {sortedUsers.map((user) => (
                  <tr key={user.user_id} className="hover:bg-teal-200 transition">
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.user_id}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                      <Link href={`/user/${user.user_id}`} className="text-blue-600 hover:underline">
                        {user.dj_name}
                      </Link>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                      {playStyle === "SP" ? (user.ability_clear_sp ?? "-") : (user.ability_clear_dp ?? "-")}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                      {playStyle === "SP" ? (user.ability_score_sp ?? "-") : (user.ability_score_dp ?? "-")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Applayout>
  );
}