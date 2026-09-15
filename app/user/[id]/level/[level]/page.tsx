"use client";

import { use, useEffect, useState } from "react";
import AppLayout from "@/components/Applayout";
import SongRecordTable from "@/components/SongRecordTable";

export default function UserLevelDetailPage({
  params,
}: {
  params: Promise<{ id: string; level: string }>;
}) {
  const resolvedParams = use(params);
  const userId = resolvedParams.id;
  const level = resolvedParams.level;

  const [djName, setDjName] = useState<string>("Loading...");

  useEffect(() => {
    fetch(`http://localhost:8000/api/v1/users/${userId}/records?style=SP&mode=level&p1=${level}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.dj_name) {
          setDjName(data.dj_name);
        } else {
          setDjName(`ID: ${userId}`);
        }
      })
      .catch(() => setDjName(`ID: ${userId}`));
  }, [userId, level]);

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Home", href: "/home" },
        { label: "Players", href: "/user" },
        { label: `ID: ${userId}`, href: `/user/${userId}/all` },
        { label: `Level ${level}`, href: `/user/${userId}/level/${level}` },
      ]}
    >
      <div className="space-y-6">
        <div className="bg-teal-300 p-6 rounded-lg shadow-sm border border-gray-200">
          <h2>Player Detail : {djName}</h2>
          <p className="text-sm text-gray-500">INFINITAS ID: {userId}</p>
        </div>

        {/* SongRecordTable にパスから取得した level を渡す */}
        <SongRecordTable
          userId={userId}
          mode="level"
          param1={level}
        />
      </div>
    </AppLayout>
  );
}