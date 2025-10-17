import { useMemo } from "react"
import { useGameStore } from "@/lib/store/game-store"
import { toVector3 } from "@/lib/game/utils"

const GameMap = () => {
  const level = useGameStore((state) => state.levels[state.currentLevelIndex])
  const floorColor = useMemo(() => {
    if (level.id === "plaza-puddle") return "#f7d9a4"
    if (level.id === "market-maze") return "#f4c48d"
    if (level.id === "garden-escape") return "#cde6b4"
    return "#a4d0e6"
  }, [level.id])
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[level.mapSize.x, level.mapSize.z, 1, 1]} />
        <meshStandardMaterial color={floorColor} />
      </mesh>
      {level.obstacles.map((obstacle) => (
        <mesh
          key={obstacle.id}
          position={toVector3(obstacle.position, 0.8)}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[obstacle.size.x, 1.6, obstacle.size.z]} />
          <meshStandardMaterial color="#3f3122" roughness={0.8} />
        </mesh>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[level.mapSize.x - 4, level.mapSize.z - 4, 32, 32]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.08} />
      </mesh>
    </group>
  )
}

export { GameMap }
