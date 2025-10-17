"use client"

import { useFrame } from "@react-three/fiber"
import { useGameStore } from "@/lib/store/game-store"
import { lerp } from "@/lib/game/math"

const CameraRig = () => {
  const playerPosition = useGameStore((state) => state.player.position)
  useFrame(({ camera }, delta) => {
    if (!('lookAt' in camera)) {
      return
    }
    const alpha = 1 - Math.pow(0.15, delta)
    camera.position.x = lerp(camera.position.x, playerPosition.x, alpha)
    camera.position.y = lerp(camera.position.y, 46, alpha)
    camera.position.z = lerp(camera.position.z, playerPosition.z + 0.1, alpha)
    camera.lookAt(playerPosition.x, 0, playerPosition.z)
  })
  return null
}

export { CameraRig }
