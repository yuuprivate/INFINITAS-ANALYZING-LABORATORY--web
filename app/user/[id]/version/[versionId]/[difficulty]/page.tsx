"use client";

import { use, useEffect, useState } from "react";
import AppLayout from "@/components/Applayout";
import SongRecordTable from "@/components/SongRecordTable";

export default function UserVersionDetailPage({
  params,
}: {
  params: Promise<{ id: string; versionId: string; difficulty: string }>;
}) {
  const resolvedParams = use(params);
  const userId = resolvedParams.id;
  const versionId = resolvedParams.versionId;
  const difficulty = resolvedParams.difficulty;

  const [djName, setDjName] = useState<string>("Loading...");

  useEffect(() => {
    fetch(`http://localhost:8000/api/v1/users/${userId}/records?style=SP&mode=version&p1=${versionId}&p2=${difficulty}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.dj_name) {
          setDjName(data.dj_name);
        } else {
          setDjName(`ID: ${userId}`);
        }
      })
      .catch(() => setDjName(`ID: ${userId}`));
  }, [userId, versionId, difficulty]);

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Home", href: "/home" },
        { label: "Players", href: "/user" },
        { label: `ID: ${userId}`, href: `/user/${userId}/all` },
        { label: `Version ${versionId} / Diff ${difficulty}`, href: `/user/${userId}/version/${versionId}/${difficulty}` },
      ]}
    >
      <div className="space-y-6">
        <div className="bg-teal-300 p-6 rounded-lg shadow-sm border border-gray-200">
          <h2>Player Detail : {djName}</h2>
          <p className="text-sm text-gray-500">INFINITAS ID: {userId}</p>
        </div>

        <SongRecordTable
          userId={userId}
          mode="version"
          param1={versionId}
          param2={difficulty}
        />
      </div>
    </AppLayout>
  );
}