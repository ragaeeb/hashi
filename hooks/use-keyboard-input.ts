"use client"

import { useEffect } from "react"
import { useGameStore } from "@/lib/store/game-store"

const directionalKeys = {
  up: new Set(["ArrowUp", "KeyW"]),
  down: new Set(["ArrowDown", "KeyS"]),
  left: new Set(["ArrowLeft", "KeyA"]),
  right: new Set(["ArrowRight", "KeyD"]),
}

const useKeyboardInput = () => {
  const setInput = useGameStore((state) => state.setInput)
  useEffect(() => {
    const active = new Set<string>()
    const computeDirection = () => {
      let x = 0
      let z = 0
      for (const key of active) {
        if (directionalKeys.left.has(key)) x -= 1
        if (directionalKeys.right.has(key)) x += 1
        if (directionalKeys.up.has(key)) z -= 1
        if (directionalKeys.down.has(key)) z += 1
      }
      setInput({ x, z })
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return
      active.add(event.code)
      computeDirection()
    }
    const handleKeyUp = (event: KeyboardEvent) => {
      active.delete(event.code)
      computeDirection()
    }
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [setInput])
}

export { useKeyboardInput }
