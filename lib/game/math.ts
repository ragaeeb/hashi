import type { Direction, Vector2 } from "./types"

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const magnitude = (value: Vector2) => Math.hypot(value.x, value.z)

const normalize = (value: Vector2) => {
  const mag = magnitude(value)
  if (mag === 0) {
    return { x: 0, z: 0 }
  }
  return { x: value.x / mag, z: value.z / mag }
}

const add = (a: Vector2, b: Vector2) => ({ x: a.x + b.x, z: a.z + b.z })

const subtract = (a: Vector2, b: Vector2) => ({ x: a.x - b.x, z: a.z - b.z })

const scale = (value: Vector2, factor: number) => ({ x: value.x * factor, z: value.z * factor })

const distance = (a: Vector2, b: Vector2) => magnitude(subtract(a, b))

const lerp = (start: number, end: number, alpha: number) => start + (end - start) * alpha

const clampVector = (value: Vector2, limit: number) => {
  const mag = magnitude(value)
  if (mag <= limit) {
    return value
  }
  return scale(normalize(value), limit)
}

const directionToFacing = (direction: Vector2): Direction => {
  if (direction.x === 0 && direction.z === 0) {
    return "idle"
  }
  const vertical = direction.z < 0 ? "up" : "down"
  const horizontal = direction.x < 0 ? "left" : direction.x > 0 ? "right" : ""
  if (horizontal && vertical) {
    return `${vertical}-${horizontal}` as Direction
  }
  if (horizontal) {
    return horizontal === "left" ? "left" : "right"
  }
  return vertical === "up" ? "up" : "down"
}

const clampPosition = (value: Vector2, size: Vector2) => {
  const halfWidth = size.x / 2
  const halfHeight = size.z / 2
  return {
    x: clamp(value.x, -halfWidth, halfWidth),
    z: clamp(value.z, -halfHeight, halfHeight),
  }
}

const withinRadius = (origin: Vector2, target: Vector2, radius: number) => distance(origin, target) <= radius

const randomUnit = () => {
  const angle = Math.random() * Math.PI * 2
  return { x: Math.cos(angle), z: Math.sin(angle) }
}

export {
  add,
  clamp,
  clampPosition,
  clampVector,
  directionToFacing,
  distance,
  lerp,
  magnitude,
  normalize,
  randomUnit,
  scale,
  subtract,
  withinRadius,
}
