"use client";

import { use } from "react";
import AppLayout from "@/components/Applayout";
import SongRecordTable from "@/components/SongRecordTable";

export default function SongsPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug || [];

  const mode = slug[0] || "level";
  const param1 = slug[1] || "12";
  const param2 = slug[2] || "3";

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Home", href: "/home" },
        { label: "Songs", href: "/songs" },
      ]}
    >
      <div>
          <h2>Song List</h2>

        {/* userId を渡さないことで曲データ一覧モードとして動く */}
        <SongRecordTable mode={mode} param1={param1} param2={param2} />
      </div>
    </AppLayout>
  );
}