"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export type RecordItem = {
  song_id: number;
  song_name?: string;
  title?: string;
  difficulty?: string;
  difficulty_type?: string;
  level: number;
  version: number;
  clear_state?: string | number;
  score?: number;
  ex_score?: number;
  bp?: number;
};

const CLEAR_MAP: Record<number, string> = {
  0: "NO PLAY",
  1: "FAILED",
  2: "ASSIST", // ASSISTED CLEAR
  3: "EASY", // EASY CLEAR
  4: "CLEAR",
  5: "HARD", // HARD CLEAR
  6: "EX-HARD", // EX HARD CLEAR
  7: "FULL-COMBO", // FULL COMBO
};

type VersionItem = {
  version_id: number;
  version_name: string;
};

interface SongRecordTableProps {
  userId?: string;
  mode?: string;
  param1?: string;
  param2?: string;
}

const DIFFICULTY_MAP: Record<number, string> = {
  0: "BEGINNER",
  1: "NORMAL",
  2: "HYPER",
  3: "ANOTHER",
  4: "LEGGENDARIA",
};

export default function SongRecordTable({
  userId,
  mode = "level",
  param1 = "12",
  param2 = "3",
}: SongRecordTableProps) {
  const router = useRouter();

  // 状態管理
  const [playStyle, setPlayStyle] = useState<"SP" | "DP">("SP");
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [versions, setVersions] = useState<VersionItem[]>([]);

  // 1. バージョン一覧を取得する専用の useEffect
    useEffect(() => {
      fetch("http://localhost:8000/api/v1/songs/versions")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setVersions(data);
          }
        })
        .catch((err) => console.error("Failed to fetch versions:", err));
    }, []);

    // 2. 楽曲・レコードデータを取得する useEffect
    useEffect(() => {
      setLoading(true);

      const baseUrl = userId
        ? `http://localhost:8000/api/v1/users/${userId}/records`
        : `http://localhost:8000/api/v1/songs`;

      const params = new URLSearchParams({
        style: playStyle,
        mode: mode,
        p1: param1,
        p2: param2,
      });

      fetch(`${baseUrl}?${params.toString()}`)
        .then((res) => res.json())
        .then((data) => {
          setRecords(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch records:", err);
          setRecords([]);
          setLoading(false);
        });
    }, [userId, playStyle, mode, param1, param2]);

  // モード・パラメータ変更ハンドラー
  const handleModeChange = (newMode: string) => {
    const basePath = userId ? `/user/${userId}` : "/song";
    if (newMode === "all") {
      router.push(`${basePath}/all`);
    } else if (newMode === "level") {
      router.push(`${basePath}/level/12`);
    } else if (newMode === "version") {
      router.push(`${basePath}/version/0/3`);
    }
  };

  const handleLevelSelect = (lvl: number) => {
    const basePath = userId ? `/user/${userId}` : "/song";
    router.push(`${basePath}/level/${lvl}`);
  };

  const handleVersionChange = (v: number) => {
    const basePath = userId ? `/user/${userId}` : "/song";
    router.push(`${basePath}/version/${v}/${param2}`);
  };

  const handleDiffChange = (d: number) => {
    const basePath = userId ? `/user/${userId}` : "/song";
    router.push(`${basePath}/version/${param1}/${d}`);
  };

  return (
    <div>
      {/* 1. 上部コントロール（SP/DP スイッチ ＆ モード切替） */}
      <div className="bg-teal-300 p-3 rounded-lg shadow-sm border border-gray-200 flex flex-wrap justify-between items-center gap-3">
        {/* SP / DP 切替 */}
        <div className="inline-flex rounded-md shadow-sm">
          <button
            onClick={() => setPlayStyle("SP")}
            className={`px-3 py-1 text-xs font-medium rounded-l-md border ${
              playStyle === "SP"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            SP
          </button>
          <button
            onClick={() => setPlayStyle("DP")}
            className={`px-3 py-1 text-xs font-medium rounded-r-md border ${
              playStyle === "DP"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            DP
          </button>
        </div>

        {/* 表示モード切替ボタン (全表示 / Level / Version) */}
        <div className="flex space-x-1.5">
          <button
            onClick={() => handleModeChange("all")}
            className={`px-2.5 py-1 text-xs font-medium rounded-md border ${
              mode === "all"
                ? "bg-gray-800 text-white border-gray-800"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            ALL
          </button>
          <button
            onClick={() => handleModeChange("level")}
            className={`px-2.5 py-1 text-xs font-medium rounded-md border ${
              mode === "level"
                ? "bg-gray-800 text-white border-gray-800"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            Level
          </button>
          <button
            onClick={() => handleModeChange("version")}
            className={`px-2.5 py-1 text-xs font-medium rounded-md border ${
              mode === "version"
                ? "bg-gray-800 text-white border-gray-800"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            Version
          </button>
        </div>
      </div>

      {/* 2. フィルター（Level 絞り込み: ulタグ） */}
      {mode === "level" && (
        <div className="bg-teal-300 p-3 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <p className="text-xs font-bold text-gray-500 tracking-wider whitespace-nowrap">
              Level
            </p>
            <ul className="flex flex-wrap gap-1">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((lvl) => {
                const isSelected = Number(param1) === lvl;
                return (
                  <li key={lvl}>
                    <button
                      onClick={() => handleLevelSelect(lvl)}
                      className={`w-5 h-5 rounded-md font-bold text-xs transition flex items-center justify-center ${
                        isSelected
                          ? "bg-blue-600 text-white shadow"
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {lvl}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {/* 3. フィルター（Version ＆ 難易度 絞り込み） */}
      {mode === "version" && (
        <div className="bg-teal-300 p-3 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            {/* Version グループ（左側） */}
            <div className="flex items-center space-x-2">
              <label className="text-xs font-bold text-gray-700">Version:</label>
              <select
                value={Number(param1)}
                onChange={(e) => handleVersionChange(Number(e.target.value))}
                className="border border-gray-300 rounded-md bg-white text-gray-900 text-xs px-2"
              >
                {versions.map((v) => (
                  <option key={v.version_id} value={v.version_id}>
                    {v.version_id}: {v.version_name}
                  </option>
                ))}
              </select>
            </div>

            {/* 難易度 グループ（右側） */}
            <div className="flex items-center space-x-2">
              <label className="text-xs font-bold text-gray-700">difficult:</label>
              <select
                value={Number(param2)}
                onChange={(e) => handleDiffChange(Number(e.target.value))}
                className="border border-gray-300 rounded-md bg-white text-gray-900 text-xs px-2"
              >
                {Object.entries(DIFFICULTY_MAP).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

{/* 4. データテーブル */}
      <div className="shadow rounded-lg overflow-x-auto border border-gray-200">
        {loading ? (
          <p className="p-8 text-center text-gray-500">読み込み中...</p>
        ) : records.length === 0 ? (
          <p className="p-8 text-center text-gray-500">該当するデータがありません。</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-teal-400">
              <tr>
                <th>Level</th>
                <th>Title</th>
                <th>Difficult</th>
                <th>Version</th>
                {userId && (<>
                    <th>Clear</th>
                    <th>Score</th>
                    <th>BP</th> </>
                )}
              </tr>
            </thead>
            <tbody>
              {records.map((rec, index) => (
                <tr key={index}>
                  <td>☆{rec.level}</td>
                  <td>{rec.song_name || rec.title}</td>
                  <td>{rec.difficulty || rec.difficulty_type}</td>
                  <td>{rec.version}</td>
                  {userId && (
                    <>
                      <td>{rec.clear_state !== undefined && rec.clear_state !== null ? CLEAR_MAP[Number(rec.clear_state)] ?? rec.clear_state : "-"}</td>
                      <td>{rec.ex_score ?? rec.score ?? "-"}</td>
                      <td>{rec.bp ?? "-"}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}