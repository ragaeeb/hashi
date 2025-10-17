"use client"

import { DirectionIndicator } from "./direction-indicator"
import { LevelInfo } from "./level-info"
import { StatusOverlay } from "./status-overlay"

const Hud = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-6">
      <div className="flex flex-wrap items-start gap-4">
        <LevelInfo />
      </div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <DirectionIndicator />
        <div className="pointer-events-auto rounded-3xl bg-white/75 p-4 shadow-lg backdrop-blur">
          <p className="text-sm font-semibold text-stone-700">Use WASD or arrow keys to guide the flock.</p>
          <p className="text-xs text-stone-500">Stay out of the dogs’ glow and keep the family together.</p>
        </div>
      </div>
      <StatusOverlay />
    </div>
  )
}

export { Hud }
