"use client";
import { useState } from "react";
import { createQuestion } from "@/lib/firebase/firestore";

// Expects an Excel/CSV file with columns:
// Chapter | Question Text | Option A | Option B | Option C | Option D | Correct Answer | Explanation | Difficulty | Tags
// Requires the `xlsx` package (already in package.json dependencies).

interface Props {
  chapterMap: Record<string, string>; // chapterName -> chapterId
  onComplete: (count: number) => void;
}

export function BulkUpload({ chapterMap, onComplete }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file: File) => {
    setBusy(true); setError("");
    try {
      const XLSX = await import("xlsx");
      const buffer = await file.arrayBuffer();
      const wb = XLSX.read(buffer, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, string>>(ws);

      let count = 0;
      for (const row of rows) {
        const chapterName = row["Chapter"];
        const chapterId   = chapterMap[chapterName] ?? "";
        await createQuestion({
          chapterId,
          chapterName,
          text: row["Question Text"] ?? "",
          options: [
            { id: "a", text: row["Option A"] ?? "" },
            { id: "b", text: row["Option B"] ?? "" },
            { id: "c", text: row["Option C"] ?? "" },
            { id: "d", text: row["Option D"] ?? "" },
          ],
          correctAnswer: (row["Correct Answer"] ?? "a").toLowerCase(),
          explanation: row["Explanation"] ?? "",
          difficulty: (row["Difficulty"]?.toLowerCase() as any) ?? "medium",
          tags: row["Tags"]?.split(",").map((t) => t.trim()) ?? [],
          type: "single",
          references: [],
        });
        count++;
      }
      onComplete(count);
    } catch (e: any) {
      setError(e.message ?? "Failed to parse file");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-navy-card rounded-2xl p-5 border border-white/8">
      <p className="font-bold text-white text-sm mb-3">📥 Bulk Upload from Excel</p>
      <div className="border-2 border-dashed border-white/12 rounded-xl p-8 text-center mb-3">
        <div className="text-4xl mb-2">📊</div>
        <input type="file" accept=".xlsx,.xls,.csv"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          className="text-sm text-slate-400" disabled={busy} />
      </div>
      <p className="text-xs text-slate-500">
        Required columns: <strong className="text-white">Chapter | Question Text | Option A | Option B | Option C | Option D | Correct Answer | Explanation | Difficulty | Tags</strong>
      </p>
      {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
      {busy && <p className="text-xs text-primary-400 mt-2">Importing…</p>}
    </div>
  );
}
