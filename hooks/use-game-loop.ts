"use client"

import { useFrame } from "@react-three/fiber"
import { useGameStore } from "@/lib/store/game-store"

const useGameLoop = () => {
  const tick = useGameStore((state) => state.tick)
  useFrame((_, delta) => {
    tick(delta)
  })
}

export { useGameLoop }
