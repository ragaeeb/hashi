"use client"

import { useMemo } from "react"
import { useGameStore } from "@/lib/store/game-store"

const LevelInfo = () => {
  const level = useGameStore((state) => state.levels[state.currentLevelIndex])
  const index = useGameStore((state) => state.currentLevelIndex)
  const lives = useGameStore((state) => state.lives)
  const badgeColor = useMemo(() => {
    if (level.kind === "adult") return "bg-sky-200 text-sky-800"
    if (level.kind === "multi") return "bg-emerald-200 text-emerald-800"
    return "bg-amber-200 text-amber-800"
  }, [level.kind])
  return (
    <div className="flex flex-col gap-3 rounded-3xl bg-white/80 p-5 shadow-lg shadow-yellow-200 backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div className={`rounded-full px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] ${badgeColor}`}>
          {level.kind === "adult" ? "Mama Mission" : level.kind === "multi" ? "Sibling Search" : "Lost Duckling"}
        </div>
        <div className="flex items-center gap-1 text-sm font-semibold text-stone-700">
          <span>Lives</span>
          <span className="text-lg text-rose-500">{"❤".repeat(Math.max(lives, 0)) || "♡"}</span>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-black text-stone-900">Level {index + 1}: {level.name}</h2>
        <p className="text-sm text-stone-600">Guide the family across the city while avoiding mischievous pups.</p>
      </div>
    </div>
  )
}

export { LevelInfo }
