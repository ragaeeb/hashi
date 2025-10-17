"use client"

import { useMemo } from "react"
import { useGameStore } from "@/lib/store/game-store"
import { facingLabel } from "@/lib/game/utils"
import type { Direction } from "@/lib/game/types"

const arrows: Record<Direction, string> = {
  up: "↑",
  down: "↓",
  left: "←",
  right: "→",
  "up-left": "↖",
  "up-right": "↗",
  "down-left": "↙",
  "down-right": "↘",
  idle: "•",
}

const DirectionIndicator = () => {
  const facing = useGameStore((state) => state.player.facing)
  const input = useGameStore((state) => state.input)
  const intensity = useMemo(() => {
    if (input.x === 0 && input.z === 0) return "bg-stone-200"
    return "bg-amber-300"
  }, [input.x, input.z])
  return (
    <div className="flex flex-col items-start gap-2 rounded-2xl bg-white/70 p-4 shadow-inner shadow-yellow-200 backdrop-blur">
      <span className="text-xs font-semibold uppercase tracking-widest text-stone-500">Direction</span>
      <div className="flex items-center gap-2">
        <div className={`grid h-12 w-12 place-items-center rounded-full text-lg font-semibold text-stone-900 ${intensity}`}>
          {arrows[facing]}
        </div>
        <span className="max-w-[10rem] text-sm font-medium text-stone-700">{facingLabel[facing]}</span>
      </div>
    </div>
  )
}

export { DirectionIndicator }
