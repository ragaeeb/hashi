import { LEVELS } from "./levels"
import {
  add,
  clamp,
  clampPosition,
  directionToFacing,
  distance,
  normalize,
  randomUnit,
  scale,
  subtract,
  withinRadius,
} from "./math"
import type {
  DucklingState,
  EnemyState,
  GameState,
  LevelConfig,
  MotherState,
  PlayerState,
  Vector2,
} from "./types"

const PLAYER_RADIUS = 1.2
const MOTHER_RADIUS = 1.4
const DUCKLING_RADIUS = 1
const ENEMY_RADIUS = 1.3
const SIBLING_SPEED = 3.4
const COMPANION_SPEED = 3.8
const WANDER_INTERVAL = 2.6
const WANDER_BOOST = 0.65
const RETURN_SPEED = 5.2
const PROXIMITY_BUFFER = 0.2
const LOST_RELEASE_RADIUS = 5

const isCircleCollidingWithObstacle = (
  center: Vector2,
  radius: number,
  obstacle: { position: Vector2; size: Vector2 },
) => {
  const halfWidth = obstacle.size.x / 2
  const halfHeight = obstacle.size.z / 2
  const closestX = clamp(center.x, obstacle.position.x - halfWidth, obstacle.position.x + halfWidth)
  const closestZ = clamp(center.z, obstacle.position.z - halfHeight, obstacle.position.z + halfHeight)
  const dx = center.x - closestX
  const dz = center.z - closestZ
  return dx * dx + dz * dz <= radius * radius
}

const resolveCollisions = (
  proposed: Vector2,
  previous: Vector2,
  radius: number,
  level: LevelConfig,
) => {
  const clamped = clampPosition(proposed, level.mapSize)
  const resolved = clamped
  let colliding = false
  for (const obstacle of level.obstacles) {
    if (isCircleCollidingWithObstacle(resolved, radius, obstacle)) {
      colliding = true
      break
    }
  }
  if (!colliding) {
    return resolved
  }
  const revertX = { x: previous.x, z: resolved.z }
  const revertZ = { x: resolved.x, z: previous.z }
  let resolveXValid = true
  for (const obstacle of level.obstacles) {
    if (isCircleCollidingWithObstacle(revertX, radius, obstacle)) {
      resolveXValid = false
      break
    }
  }
  if (resolveXValid) {
    return clampPosition(revertX, level.mapSize)
  }
  let resolveZValid = true
  for (const obstacle of level.obstacles) {
    if (isCircleCollidingWithObstacle(revertZ, radius, obstacle)) {
      resolveZValid = false
      break
    }
  }
  if (resolveZValid) {
    return clampPosition(revertZ, level.mapSize)
  }
  return previous
}

const createPlayer = (level: LevelConfig): PlayerState => ({
  id: "player",
  position: level.playerSpawn,
  velocity: { x: 0, z: 0 },
  radius: PLAYER_RADIUS,
  maxSpeed: 6,
  acceleration: 16,
  deceleration: 18,
  facing: "down",
})

const createMother = (level: LevelConfig): MotherState | null => {
  if (!level.motherSpawn) {
    return null
  }
  return {
    id: "mother",
    position: level.motherSpawn,
    velocity: { x: 0, z: 0 },
    radius: MOTHER_RADIUS,
  }
}

const createDucklings = (level: LevelConfig) => level.ducklingSpawns.map((spawn, index): DucklingState => ({
  id: `duckling-${index}`,
  position: spawn.position,
  velocity: { x: 0, z: 0 },
  radius: DUCKLING_RADIUS,
  role: spawn.role,
  wanderDirection: randomUnit(),
  wanderTimer: Math.random() * WANDER_INTERVAL,
  returning: false,
}))

const createEnemies = (level: LevelConfig) =>
  level.enemySpawns.map((spawn, index): EnemyState => ({
    id: `enemy-${index}`,
    position: spawn.position,
    velocity: { x: 0, z: 0 },
    radius: ENEMY_RADIUS,
    detectionRadius: spawn.detectionRadius,
    chaseSpeed: spawn.chaseSpeed,
    patrolSpeed: spawn.patrolSpeed,
    mode: "patrol",
    patrolPoints: spawn.patrolPoints,
    patrolIndex: 0,
  }))

const buildInitialState = (levelIndex: number, lives: number): GameState => {
  const level = LEVELS[levelIndex]
  return {
    levels: LEVELS,
    currentLevelIndex: levelIndex,
    player: createPlayer(level),
    mother: createMother(level),
    ducklings: createDucklings(level),
    enemies: createEnemies(level),
    status: "playing",
    lives,
    holdTimer: 0,
    input: { x: 0, z: 0 },
  }
}

const approachVelocity = (
  current: Vector2,
  desired: Vector2,
  delta: number,
  acceleration: number,
) => {
  const difference = subtract(desired, current)
  const maxChange = acceleration * delta
  const distanceToDesired = Math.hypot(difference.x, difference.z)
  if (distanceToDesired <= maxChange) {
    return desired
  }
  return add(current, scale(normalize(difference), maxChange))
}

const updatePlayer = (
  player: PlayerState,
  input: Vector2,
  delta: number,
  level: LevelConfig,
) => {
  const hasInput = input.x !== 0 || input.z !== 0
  const desired = hasInput ? scale(normalize(input), player.maxSpeed) : { x: 0, z: 0 }
  const acceleration = hasInput ? player.acceleration : player.deceleration
  const newVelocity = approachVelocity(player.velocity, desired, delta, acceleration)
  const newPosition = add(player.position, scale(newVelocity, delta))
  const resolvedPosition = resolveCollisions(newPosition, player.position, player.radius, level)
  const facing = directionToFacing(hasInput ? normalize(input) : newVelocity)
  return {
    ...player,
    position: resolvedPosition,
    velocity: newVelocity,
    facing,
  }
}

const updateDuckling = (
  duckling: DucklingState,
  level: LevelConfig,
  delta: number,
  player: PlayerState,
  mother: MotherState | null,
) => {
  let wanderDirection = duckling.wanderDirection
  let wanderTimer = duckling.wanderTimer - delta
  let returning = duckling.returning
  const wanderSpeed = duckling.role === "companion" ? COMPANION_SPEED : SIBLING_SPEED
  const maxDistanceTarget = duckling.role === "lost" ? level.wanderRadius * 2 : level.wanderRadius
  const anchor = level.kind === "adult" ? player.position : mother ? mother.position : player.position
  if (duckling.role === "lost" && !returning) {
    const playerDistance = distance(duckling.position, player.position)
    if (playerDistance <= LOST_RELEASE_RADIUS) {
      returning = true
    }
  }
  if (duckling.role !== "lost") {
    const anchorDistance = distance(duckling.position, anchor)
    if (anchorDistance > maxDistanceTarget) {
      returning = true
    }
  }
  if (returning) {
    const target = duckling.role === "lost" ? player.position : anchor
    const direction = normalize(subtract(target, duckling.position))
    const velocity = scale(direction, RETURN_SPEED)
    const proposed = add(duckling.position, scale(velocity, delta))
    const resolved = resolveCollisions(proposed, duckling.position, duckling.radius, level)
    const reached = withinRadius(resolved, target, duckling.radius + PROXIMITY_BUFFER)
    return {
      ...duckling,
      position: resolved,
      velocity,
      wanderDirection,
      wanderTimer,
      returning: !reached,
    }
  }
  if (wanderTimer <= 0) {
    wanderDirection = normalize(add(wanderDirection, scale(randomUnit(), WANDER_BOOST)))
    wanderTimer = WANDER_INTERVAL + Math.random() * WANDER_INTERVAL
  }
  const target = duckling.role === "lost" ? player.position : anchor
  const anchorInfluence = normalize(subtract(target, duckling.position))
  const blendedDirection = normalize(add(scale(wanderDirection, 0.8), scale(anchorInfluence, 0.6)))
  const baseVelocity = scale(blendedDirection, wanderSpeed)
  const proposed = add(duckling.position, scale(baseVelocity, delta))
  const resolved = resolveCollisions(proposed, duckling.position, duckling.radius, level)
  return {
    ...duckling,
    position: resolved,
    velocity: baseVelocity,
    wanderDirection,
    wanderTimer,
    returning,
  }
}

const updateDucklings = (
  ducklings: DucklingState[],
  level: LevelConfig,
  delta: number,
  player: PlayerState,
  mother: MotherState | null,
) => ducklings.map((duckling) => updateDuckling(duckling, level, delta, player, mother))

const updateEnemy = (
  enemy: EnemyState,
  delta: number,
  player: PlayerState,
  level: LevelConfig,
) => {
  const playerDistance = distance(enemy.position, player.position)
  let mode = enemy.mode
  if (playerDistance <= enemy.detectionRadius) {
    mode = "chase"
  } else if (mode === "chase" && playerDistance > enemy.detectionRadius * 1.4) {
    mode = "patrol"
  }
  if (mode === "chase") {
    const direction = normalize(subtract(player.position, enemy.position))
    const velocity = scale(direction, enemy.chaseSpeed)
    const proposed = add(enemy.position, scale(velocity, delta))
    const resolved = resolveCollisions(proposed, enemy.position, enemy.radius, level)
    return {
      ...enemy,
      position: resolved,
      velocity,
      mode,
    }
  }
  const targetPoint = enemy.patrolPoints[enemy.patrolIndex] ?? enemy.position
  const toTarget = subtract(targetPoint, enemy.position)
  const distanceToTarget = Math.hypot(toTarget.x, toTarget.z)
  let patrolIndex = enemy.patrolIndex
  if (distanceToTarget < 1) {
    patrolIndex = (enemy.patrolIndex + 1) % enemy.patrolPoints.length
  }
  const direction = distanceToTarget === 0 ? randomUnit() : normalize(toTarget)
  const velocity = scale(direction, enemy.patrolSpeed)
  const proposed = add(enemy.position, scale(velocity, delta))
  const resolved = resolveCollisions(proposed, enemy.position, enemy.radius, level)
  return {
    ...enemy,
    position: resolved,
    velocity,
    mode,
    patrolIndex,
  }
}

const updateEnemies = (
  enemies: EnemyState[],
  delta: number,
  player: PlayerState,
  level: LevelConfig,
) => enemies.map((enemy) => updateEnemy(enemy, delta, player, level))

const evaluateSingleWin = (
  player: PlayerState,
  mother: MotherState | null,
  radius: number,
) => {
  if (!mother) {
    return false
  }
  return withinRadius(player.position, mother.position, radius)
}

const evaluateMultiWin = (
  player: PlayerState,
  mother: MotherState | null,
  ducklings: DucklingState[],
  radius: number,
) => {
  if (!mother) {
    return false
  }
  if (!withinRadius(player.position, mother.position, radius)) {
    return false
  }
  return ducklings.every((duckling) => withinRadius(duckling.position, mother.position, radius))
}

const evaluateAdultWin = (
  player: PlayerState,
  ducklings: DucklingState[],
  radius: number,
) => ducklings.every((duckling) => withinRadius(duckling.position, player.position, radius))

const detectLoss = (
  player: PlayerState,
  enemies: EnemyState[],
) => enemies.some((enemy) => withinRadius(player.position, enemy.position, player.radius + enemy.radius * 0.7))

const stepGame = (
  state: GameState,
  delta: number,
): GameState => {
  if (state.status !== "playing") {
    return state
  }
  const level = state.levels[state.currentLevelIndex]
  const updatedPlayer = updatePlayer(state.player, state.input, delta, level)
  const updatedMother = state.mother
  const updatedDucklings = updateDucklings(state.ducklings, level, delta, updatedPlayer, updatedMother)
  const updatedEnemies = updateEnemies(state.enemies, delta, updatedPlayer, level)
  if (detectLoss(updatedPlayer, updatedEnemies)) {
    const remainingLives = state.lives - 1
    return {
      ...state,
      player: updatedPlayer,
      ducklings: updatedDucklings,
      enemies: updatedEnemies,
      status: remainingLives > 0 ? "lost" : "lost",
      lives: Math.max(remainingLives, 0),
    }
  }
  let holdTimer = state.holdTimer
  let won = false
  if (level.kind === "single") {
    const satisfied = evaluateSingleWin(updatedPlayer, updatedMother, level.proximityRadius)
    holdTimer = satisfied ? holdTimer + delta : 0
    won = holdTimer >= level.holdDuration
  } else if (level.kind === "multi") {
    const satisfied = evaluateMultiWin(updatedPlayer, updatedMother, updatedDucklings, level.proximityRadius)
    holdTimer = satisfied ? holdTimer + delta : 0
    won = holdTimer >= level.holdDuration
  } else {
    const satisfied = evaluateAdultWin(updatedPlayer, updatedDucklings, level.proximityRadius)
    holdTimer = satisfied ? holdTimer + delta : 0
    won = holdTimer >= level.holdDuration && updatedDucklings.every((duckling) => !duckling.returning)
  }
  if (won) {
    return {
      ...state,
      player: updatedPlayer,
      ducklings: updatedDucklings,
      enemies: updatedEnemies,
      status: "won",
      holdTimer,
    }
  }
  return {
    ...state,
    player: updatedPlayer,
    ducklings: updatedDucklings,
    enemies: updatedEnemies,
    holdTimer,
  }
}

export { buildInitialState, stepGame }
