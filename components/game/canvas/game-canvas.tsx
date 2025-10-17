"use client"

import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { ContactShadows, Environment } from "@react-three/drei"
import { useKeyboardInput } from "@/hooks/use-keyboard-input"
import { useGameLoop } from "@/hooks/use-game-loop"
import { CameraRig } from "./camera-rig"
import { GameMap } from "./game-map"
import { Entities } from "./entities"

const SceneContent = () => {
  useGameLoop()
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[18, 36, 24]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <Environment preset="sunset" />
      <GameMap />
      <Entities />
      <ContactShadows
        opacity={0.3}
        width={120}
        height={120}
        position={[0, -0.01, 0]}
        blur={2}
        far={40}
      />
      <CameraRig />
    </>
  )
}

const GameCanvas = () => {
  useKeyboardInput()
  return (
    <Canvas
      orthographic
      shadows
      camera={{ position: [0, 48, 0], zoom: 22, near: 0.1, far: 200 }}
      gl={{ antialias: true }}
      className="rounded-3xl border-4 border-yellow-200 shadow-xl"
    >
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  )
}

export { GameCanvas }
