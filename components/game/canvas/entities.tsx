"use client"

import { useMemo } from "react"
import { useGameStore } from "@/lib/store/game-store"
import { toVector3 } from "@/lib/game/utils"
import { DuckModel } from "./duck-model"
import { DogModel } from "./dog-model"

const Entities = () => {
  const player = useGameStore((state) => state.player)
  const mother = useGameStore((state) => state.mother)
  const ducklings = useGameStore((state) => state.ducklings)
  const enemies = useGameStore((state) => state.enemies)
  const level = useGameStore((state) => state.levels[state.currentLevelIndex])
  const playerColor = useMemo(() => {
    if (level.kind === "adult") return { body: "#f0d889", accent: "#f5e8b8" }
    return { body: "#fbe79c", accent: "#fff2c6" }
  }, [level.kind])
  return (
    <group>
      <DuckModel
        position={toVector3(player.position, 0.2)}
        scale={1.3}
        bodyColor={playerColor.body}
        accentColor={playerColor.accent}
        beakColor="#f8a15d"
        eyeColor="#3f2a1e"
      />
      {mother ? (
        <>
          <DuckModel
            position={toVector3(mother.position, 0.2)}
            scale={1.6}
            bodyColor="#f2c572"
            accentColor="#ffe7ad"
            beakColor="#f69a4a"
            eyeColor="#3a251a"
            animationOffset={1}
          />
          <mesh position={toVector3(mother.position, 0.05)} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[level.proximityRadius - 0.3, level.proximityRadius, 32]} />
            <meshBasicMaterial color="#ffd369" transparent opacity={0.4} />
          </mesh>
        </>
      ) : null}
      {ducklings.map((duckling) => (
        <DuckModel
          key={duckling.id}
          position={toVector3(duckling.position, 0.18)}
          scale={duckling.role === "lost" ? 1.05 : 0.9}
          bodyColor={duckling.role === "lost" ? "#f7b97a" : "#fcedb3"}
          accentColor={duckling.role === "lost" ? "#ffe0b5" : "#fff4d2"}
          beakColor="#f6a05b"
          eyeColor="#2d1c12"
          animationOffset={duckling.role === "lost" ? 1.8 : 0.6}
        />
      ))}
      {ducklings.map((duckling) => (
        <mesh
          key={`${duckling.id}-aura`}
          position={toVector3(duckling.position, 0.02)}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[duckling.radius + 0.2, duckling.radius + 0.5, 20]} />
          <meshBasicMaterial
            color={duckling.role === "lost" ? "#ff9f5a" : "#ffe29d"}
            transparent
            opacity={0.35}
          />
        </mesh>
      ))}
      {enemies.map((enemy) => (
        <group key={enemy.id}>
          <DogModel position={toVector3(enemy.position, 0.2)} />
          <mesh
            position={toVector3(enemy.position, 0.02)}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[enemy.detectionRadius - 0.4, enemy.detectionRadius, 40]} />
            <meshBasicMaterial color="#f26b6b" transparent opacity={0.18} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export { Entities }
