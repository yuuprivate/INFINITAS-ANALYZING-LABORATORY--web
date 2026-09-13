"use client";

import { use , useEffect , useState} from "react";
import AppLayout from "@/components/Applayout";
import SongRecordTable from "@/components/SongRecordTable";

export default function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string; slug?: string[] }>;
}) {
  const resolvedParams = use(params);
  const userId = resolvedParams.id;
  const slug = resolvedParams.slug || [];

  const mode = slug[0] || "level";
  const param1 = slug[1] || "12";
  const param2 = slug[2] || "3";

  const [djName, setDjName] = useState<string>("Loading...");

  useEffect(() => {
    fetch(`http://localhost:8000/api/v1/users/${userId}/records?style=SP&mode=level&p1=12`)
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
        { label: "Players", href: "/users" },
        { label: `ID: ${userId}`, href: `/users/${userId}` },
      ]}
    >
      <div className="space-y-6">
        {/* プレイヤー情報ヘッダー */}
        <div className="bg-teal-300 p-6 rounded-lg shadow-sm border border-gray-200">
          <h2>Player Detail : {djName}</h2>
          <p className="text-sm text-gray-500">INFINITAS ID: {userId}</p>
        </div>

        {/* 共通データテーブルコンポーネント */}
        <SongRecordTable
          userId={userId}
          mode={mode}
          param1={param1}
          param2={param2}
        />
      </div>
    </AppLayout>
  );
}