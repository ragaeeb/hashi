import type { LevelConfig, Obstacle, Vector2 } from "./types"

const map = (width: number, height: number) => ({ x: width, z: height })

const obstacle = (id: string, position: Vector2, size: Vector2): Obstacle => ({
  id,
  position,
  size,
})

const LEVELS: LevelConfig[] = [
  {
    id: "plaza-puddle",
    name: "Plaza Puddle",
    kind: "single",
    mapSize: map(60, 60),
    playerSpawn: { x: -20, z: 20 },
    motherSpawn: { x: 22, z: -18 },
    ducklingSpawns: [],
    enemySpawns: [
      {
        position: { x: 0, z: 0 },
        patrolPoints: [
          { x: -10, z: 10 },
          { x: 10, z: 10 },
          { x: 10, z: -10 },
          { x: -10, z: -10 },
        ],
        detectionRadius: 16,
        patrolSpeed: 4,
        chaseSpeed: 6,
      },
    ],
    obstacles: [
      obstacle("fountain", { x: 0, z: 0 }, { x: 10, z: 10 }),
      obstacle("cafe", { x: -18, z: -12 }, { x: 12, z: 14 }),
    ],
    proximityRadius: 4,
    holdDuration: 1.2,
    wanderRadius: 12,
  },
  {
    id: "market-maze",
    name: "Market Maze",
    kind: "multi",
    mapSize: map(80, 70),
    playerSpawn: { x: -30, z: 24 },
    motherSpawn: { x: 28, z: -18 },
    ducklingSpawns: [
      { position: { x: -28, z: 20 }, role: "sibling" },
      { position: { x: -26, z: 22 }, role: "sibling" },
    ],
    enemySpawns: [
      {
        position: { x: 0, z: 16 },
        patrolPoints: [
          { x: -12, z: 16 },
          { x: 12, z: 16 },
        ],
        detectionRadius: 14,
        patrolSpeed: 3.6,
        chaseSpeed: 6.2,
      },
      {
        position: { x: 18, z: -10 },
        patrolPoints: [
          { x: 12, z: -14 },
          { x: 24, z: -6 },
        ],
        detectionRadius: 15,
        patrolSpeed: 3.8,
        chaseSpeed: 6.5,
      },
    ],
    obstacles: [
      obstacle("stalls-north", { x: -5, z: 18 }, { x: 36, z: 8 }),
      obstacle("stalls-center", { x: 5, z: 0 }, { x: 22, z: 12 }),
      obstacle("stalls-south", { x: -15, z: -20 }, { x: 28, z: 10 }),
    ],
    proximityRadius: 4,
    holdDuration: 1.6,
    wanderRadius: 16,
  },
  {
    id: "garden-escape",
    name: "Garden Escape",
    kind: "single",
    mapSize: map(70, 80),
    playerSpawn: { x: -24, z: 28 },
    motherSpawn: { x: 26, z: -30 },
    ducklingSpawns: [],
    enemySpawns: [
      {
        position: { x: -6, z: -12 },
        patrolPoints: [
          { x: -20, z: -20 },
          { x: 8, z: -8 },
        ],
        detectionRadius: 18,
        patrolSpeed: 4,
        chaseSpeed: 6.8,
      },
      {
        position: { x: 18, z: 20 },
        patrolPoints: [
          { x: 10, z: 24 },
          { x: 26, z: 12 },
        ],
        detectionRadius: 16,
        patrolSpeed: 3.6,
        chaseSpeed: 6.4,
      },
    ],
    obstacles: [
      obstacle("hedge-ring", { x: 0, z: 0 }, { x: 28, z: 28 }),
      obstacle("pond", { x: -16, z: 12 }, { x: 14, z: 18 }),
      obstacle("gazebo", { x: 20, z: -18 }, { x: 10, z: 10 }),
    ],
    proximityRadius: 3.8,
    holdDuration: 1.4,
    wanderRadius: 14,
  },
  {
    id: "harbor-hustle",
    name: "Harbor Hustle",
    kind: "adult",
    mapSize: map(90, 90),
    playerSpawn: { x: -30, z: -30 },
    ducklingSpawns: [
      { position: { x: -32, z: -28 }, role: "companion" },
      { position: { x: -28, z: -32 }, role: "companion" },
      { position: { x: 34, z: 24 }, role: "lost" },
    ],
    enemySpawns: [
      {
        position: { x: -8, z: 8 },
        patrolPoints: [
          { x: -20, z: 8 },
          { x: 4, z: 8 },
        ],
        detectionRadius: 18,
        patrolSpeed: 4,
        chaseSpeed: 7,
      },
      {
        position: { x: 12, z: -16 },
        patrolPoints: [
          { x: 12, z: -28 },
          { x: 18, z: -4 },
        ],
        detectionRadius: 20,
        patrolSpeed: 4.2,
        chaseSpeed: 7.2,
      },
    ],
    obstacles: [
      obstacle("warehouse", { x: -10, z: -20 }, { x: 24, z: 16 }),
      obstacle("pier", { x: 28, z: 20 }, { x: 18, z: 32 }),
      obstacle("market", { x: 6, z: 12 }, { x: 20, z: 18 }),
    ],
    proximityRadius: 4.5,
    holdDuration: 2,
    wanderRadius: 18,
  },
]

export { LEVELS }
