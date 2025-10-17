"use client"

import { useGameStore } from "@/lib/store/game-store"
import { Button } from "@/components/ui/button"

const StatusOverlay = () => {
  const status = useGameStore((state) => state.status)
  const level = useGameStore((state) => state.levels[state.currentLevelIndex])
  const isLastLevel = useGameStore((state) => state.currentLevelIndex === state.levels.length - 1)
  const lives = useGameStore((state) => state.lives)
  const advanceLevel = useGameStore((state) => state.advanceLevel)
  const restartLevel = useGameStore((state) => state.restartLevel)
  const resetGame = useGameStore((state) => state.resetGame)
  const isVictory = status === "won"
  const title = isVictory
    ? isLastLevel
      ? "Family Reunited"
      : "You Found Them"
    : lives > 0
    ? "Ouch!"
    : "Family Scattered"
  const description = isVictory
    ? isLastLevel
      ? "Every duckling is safe and snug. Celebrate the happiest waddle."
      : `The ${level.name} mission is complete. Prepare for a brand new map.`
    : lives > 0
    ? "The pups were a little too quick. Take a deep breath and try again."
    : "All lives were spent. Rally the flock for a fresh adventure."
  const primaryLabel = isVictory
    ? isLastLevel
      ? "Play Again"
      : "Next Level"
    : lives > 0
    ? "Try Again"
    : "Restart Adventure"
  const handlePrimary = () => {
    if (isVictory) {
      if (isLastLevel) {
        resetGame()
      } else {
        advanceLevel()
      }
      return
    }
    if (lives > 0) {
      restartLevel()
    } else {
      resetGame()
    }
  }
  if (status === "playing") {
    return null
  }
  return (
    <div className="pointer-events-auto absolute inset-0 z-20 flex items-center justify-center bg-stone-900/50 backdrop-blur">
      <div className="flex max-w-md flex-col gap-4 rounded-3xl bg-white p-8 text-center shadow-2xl shadow-stone-900/20">
        <span className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">Hashi Mission</span>
        <h3 className="text-3xl font-black text-stone-900">{title}</h3>
        <p className="text-sm text-stone-600">{description}</p>
        <div className="flex justify-center">
          <Button onClick={handlePrimary}>{primaryLabel}</Button>
        </div>
      </div>
    </div>
  )
}

export { StatusOverlay }
