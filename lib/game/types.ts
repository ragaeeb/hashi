type Vector2 = {
  x: number
  z: number
}

type EntityState = {
  id: string
  position: Vector2
  velocity: Vector2
  radius: number
}

type PlayerState = EntityState & {
  maxSpeed: number
  acceleration: number
  deceleration: number
  facing: Direction
}

type MotherState = EntityState

type DucklingRole = "sibling" | "lost" | "companion"

type DucklingState = EntityState & {
  role: DucklingRole
  wanderDirection: Vector2
  wanderTimer: number
  returning: boolean
}

type EnemyMode = "patrol" | "chase"

type EnemyState = EntityState & {
  detectionRadius: number
  chaseSpeed: number
  patrolSpeed: number
  mode: EnemyMode
  patrolPoints: Vector2[]
  patrolIndex: number
}

type Obstacle = {
  id: string
  position: Vector2
  size: Vector2
}

type LevelKind = "single" | "multi" | "adult"

type LevelConfig = {
  id: string
  name: string
  kind: LevelKind
  mapSize: Vector2
  playerSpawn: Vector2
  motherSpawn?: Vector2
  ducklingSpawns: {
    position: Vector2
    role: DucklingRole
  }[]
  enemySpawns: {
    position: Vector2
    patrolPoints: Vector2[]
    detectionRadius: number
    patrolSpeed: number
    chaseSpeed: number
  }[]
  obstacles: Obstacle[]
  proximityRadius: number
  holdDuration: number
  wanderRadius: number
}

type GameStatus = "loading" | "playing" | "won" | "lost"

type InputDirection = {
  x: number
  z: number
}

type Direction =
  | "up"
  | "down"
  | "left"
  | "right"
  | "up-left"
  | "up-right"
  | "down-left"
  | "down-right"
  | "idle"

type GameState = {
  levels: LevelConfig[]
  currentLevelIndex: number
  player: PlayerState
  mother: MotherState | null
  ducklings: DucklingState[]
  enemies: EnemyState[]
  status: GameStatus
  lives: number
  holdTimer: number
  input: InputDirection
}

type GameActions = {
  tick: (delta: number) => void
  setInput: (direction: InputDirection) => void
  startLevel: (index: number) => void
  advanceLevel: () => void
  restartLevel: () => void
  resetGame: () => void
}

type GameStore = GameState & GameActions

export type {
  DucklingState,
  Direction,
  EnemyState,
  GameActions,
  GameState,
  GameStatus,
  GameStore,
  InputDirection,
  LevelConfig,
  LevelKind,
  MotherState,
  Obstacle,
  PlayerState,
  Vector2,
}
