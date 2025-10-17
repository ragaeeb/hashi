"use client"

import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import type { Mesh } from "three"

const DuckModel = ({
  position,
  scale = 1,
  bodyColor,
  accentColor,
  beakColor,
  eyeColor,
  animationOffset = 0,
}: {
  position: readonly [number, number, number]
  scale?: number
  bodyColor: string
  accentColor: string
  beakColor: string
  eyeColor: string
  animationOffset?: number
}) => {
  const headRef = useRef<Mesh>(null)
  const bodyRef = useRef<Mesh>(null)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + animationOffset
    const bob = Math.sin(t * 2) * 0.1
    const wobble = Math.sin(t * 1.5) * 0.08
    if (bodyRef.current) {
      bodyRef.current.position.y = 0.6 + bob
    }
    if (headRef.current) {
      headRef.current.position.y = 1.35 + bob * 0.5
      headRef.current.rotation.z = wobble
    }
  })
  return (
    <group position={position} scale={scale} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh ref={bodyRef} castShadow receiveShadow>
        <sphereGeometry args={[0.6, 24, 24]} />
        <meshStandardMaterial color={bodyColor} roughness={0.35} metalness={0.1} />
      </mesh>
      <mesh ref={headRef} position={[0.4, 1.35, 0]} castShadow>
        <sphereGeometry args={[0.36, 24, 24]} />
        <meshStandardMaterial color={accentColor} roughness={0.4} metalness={0.05} />
      </mesh>
      <mesh position={[0.58, 1.2, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.08, 0.16, 0.3, 16]} />
        <meshStandardMaterial color={beakColor} roughness={0.2} />
      </mesh>
      <mesh position={[0.46, 1.34, 0.18]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0.46, 1.34, -0.18]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[-0.28, 0.12, 0.26]} rotation={[0, 0, Math.PI / 2]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial color={accentColor} />
      </mesh>
      <mesh position={[-0.28, 0.12, -0.26]} rotation={[0, 0, Math.PI / 2]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial color={accentColor} />
      </mesh>
    </group>
  )
}

export { DuckModel }
