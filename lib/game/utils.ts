import type { Direction, Vector2 } from "./types"

const toVector3 = (value: Vector2, height = 0) => [value.x, height, value.z] as const

const facingLabel: Record<Direction, string> = {
  up: "Facing North",
  down: "Facing South",
  left: "Facing West",
  right: "Facing East",
  "up-left": "Facing Northwest",
  "up-right": "Facing Northeast",
  "down-left": "Facing Southwest",
  "down-right": "Facing Southeast",
  idle: "Standing",
}

export { facingLabel, toVector3 }
