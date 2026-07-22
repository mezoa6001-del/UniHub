"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { subscribeLeaderboard } from "@/lib/firebase/firestore";
import { EmptyState, Spinner } from "@/components/ui";
import type { LeaderboardEntry } from "@/types";

export default function LeaderboardPage() {
  const { profile } = useAuth();
  const [board, setBoard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeLeaderboard((entries) => {
      setBoard(entries);
      setLoading(false);
    });

    return unsub;
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size={40} />
      </div>
    );
  }

  if (!board.length) {
    return (
      <EmptyState
        icon="🏆"
        title="Leaderboard is empty"
        desc="Complete exams to appear here!"
      />
    );
  }

  const medals = ["🥇", "🥈", "🥉"];
  const medalColors = ["#FFD700", "#C0C0C0", "#CD7F32"];

  const getAccuracy = (player: LeaderboardEntry) => {
    const answered = player.questionsAnswered ?? 0;
    const correct = (player as any).correctAnswers ?? 0;

    if (answered === 0) return 0;

    return Math.round((correct / answered) * 100);
  };

  return (
    <div className="space-y-6">
      {board.length >= 3 && (
        <div className="flex items-end justify-center gap-4 py-4">
          {[board[1], board[0], board[2]].map((player, index) => {
            const rank = [2, 1, 3][index];
            const color = medalColors[rank - 1];
            const heights = [120, 150, 100];

            return (
              <div
                key={player.id}
                className="flex flex-col items-center flex-1 max-w-[130px]"
              >
                <span className="text-2xl mb-2">{medals[rank - 1]}</span>

                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-xs font-extrabold text-white mb-2"
                  style={{
                    background:
                      player.id === profile?.uid
                        ? "linear-gradient(135deg,#2FA084,#6FCF97)"
                        : "#1A2940",
                    border:
                      player.id === profile?.uid
                        ? "3px solid #2FA084"
                        : "none",
                  }}
                >
                  {player.avatarInitials ??
                    player.displayName?.substring(0, 2).toUpperCase()}
                </div>

                <p className="text-xs font-bold text-white text-center truncate w-full mb-2">
                  {player.displayName}
                  {player.id === profile?.uid && (
                    <span className="text-primary-400"> (You)</span>
                  )}
                </p>

                <div
                  className="w-full flex items-center justify-center rounded-t-lg"
                  style={{
                    height: heights[index],
                    background: color + "25",
                    border: `2px solid ${color}`,
                  }}
                >
                  <span
                    className="text-xl font-extrabold"
                    style={{ color }}
                  >
                    #{rank}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="bg-navy-card rounded-2xl border border-white/8 overflow-hidden">
        <div className="grid grid-cols-[40px_1fr_90px_80px] gap-3 px-5 py-3 border-b border-white/8">
          {["#", "Student", "Score", "Accuracy"].map((header) => (
            <span
              key={header}
              className="text-[11px] font-bold text-slate-500 uppercase tracking-wider"
            >
              {header}
            </span>
          ))}
        </div>

        {board.map((player, index) => {
          const accuracy = getAccuracy(player);

          return (
            <div
              key={player.id}
              className="grid grid-cols-[40px_1fr_90px_80px] gap-3 px-5 py-3.5 border-b border-white/5 items-center last:border-0"
              style={{
                background:
                  player.id === profile?.uid
                    ? "#2FA08408"
                    : "transparent",
              }}
            >
              <span
                className="text-sm font-extrabold"
                style={{
                  color: index < 3 ? medalColors[index] : "#7A99BB",
                }}
              >
                #{index + 1}
              </span>

              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[11px] font-extrabold text-white"
                  style={{
                    background:
                      player.id === profile?.uid
                        ? "linear-gradient(135deg,#2FA084,#6FCF97)"
                        : "#1A2940",
                  }}
                >
                  {player.avatarInitials ??
                    player.displayName?.substring(0, 2).toUpperCase()}
                </div>

                <span className="text-sm font-semibold text-white truncate">
                  {player.displayName}
                  {player.id === profile?.uid && (
                    <span className="text-primary-400 text-xs">
                      {" "}
                      (You)
                    </span>
                  )}
                </span>
              </div>

              <span className="text-sm font-bold text-white">
                {(player.totalScore ?? 0).toLocaleString()}
              </span>

              <span
                className="text-sm font-semibold"
                style={{
                  color: accuracy >= 80 ? "#2FA084" : "#F59E0B",
                }}
              >
                {accuracy}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}