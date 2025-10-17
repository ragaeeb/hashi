"use client"

import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import type { Mesh } from "three"

const DogModel = ({
  position,
  accentColor = "#b95f36",
}: {
  position: readonly [number, number, number]
  accentColor?: string
}) => {
  const bodyRef = useRef<Mesh>(null)
  useFrame(({ clock }) => {
    const wobble = Math.sin(clock.getElapsedTime() * 3) * 0.08
    if (bodyRef.current) {
      bodyRef.current.rotation.y = wobble
    }
  })
  return (
    <group position={position}>
      <mesh ref={bodyRef} castShadow receiveShadow>
        <sphereGeometry args={[0.8, 20, 20]} />
        <meshStandardMaterial color={accentColor} roughness={0.55} />
      </mesh>
      <mesh position={[0.7, 0.5, 0]} castShadow>
        <sphereGeometry args={[0.4, 20, 20]} />
        <meshStandardMaterial color="#8d3f27" roughness={0.5} />
      </mesh>
      <mesh position={[0.95, 0.45, 0]}>
        <cylinderGeometry args={[0.12, 0.2, 0.3, 16]} />
        <meshStandardMaterial color="#f68b3c" />
      </mesh>
      <mesh position={[0.68, 0.62, 0.26]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#1b0d0a" emissive="#1b0d0a" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.68, 0.62, -0.26]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#1b0d0a" emissive="#1b0d0a" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-0.6, 0.1, 0]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.08, 0.12, 0.4, 12]} />
        <meshStandardMaterial color="#8d3f27" />
      </mesh>
    </group>
  )
}

export { DogModel }
