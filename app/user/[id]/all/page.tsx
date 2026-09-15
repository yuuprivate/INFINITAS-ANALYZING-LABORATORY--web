"use client";

import { use, useEffect, useState } from "react";
import AppLayout from "@/components/Applayout";
import SongRecordTable from "@/components/SongRecordTable";

export default function UserDefaultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const userId = resolvedParams.id;

  const [djName, setDjName] = useState<string>("Loading...");

  useEffect(() => {
    fetch(`http://localhost:8000/api/v1/users/${userId}/records?style=SP&mode=all`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0 && data[0].dj_name) {
          setDjName(data[0].dj_name);
        } else {
          setDjName(`ID: ${userId}`);
        }
      })
      .catch(() => setDjName(`ID: ${userId}`));
  }, [userId]);

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Home", href: "/home" },
        { label: "Players", href: "/user" },
        { label: `ID: ${userId}`, href: `/user/${userId}` },
      ]}
    >
      <div className="space-y-6">
        <div className="bg-teal-300 p-6 rounded-lg shadow-sm border border-gray-200">
          <h2>Player Detail : {djName}</h2>
          <p className="text-sm text-gray-500">INFINITAS ID: {userId}</p>
        </div>

        {/* デフォルトで全曲表示、またはお好みの初期モードを指定 */}
        <SongRecordTable
          userId={userId}
          mode="all"
        />
      </div>
    </AppLayout>
  );
}