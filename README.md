# Hashi

Hashi is a cozy city adventure built with Next.js 15.5 and React Three Fiber. Guide a courageous duck family through painterly districts, dodge mischievous pups, and reunite every duckling with its flock.

## Getting Started

Install dependencies with [Bun](https://bun.sh/):

```bash
bun install
```

Run the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to explore the latest build. The app supports fast refresh, so edits appear immediately.

## Game Highlights

- Smooth eight-directional movement with acceleration and easing
- Lerped orthographic camera that hugs the player without abrupt shifts
- Multiple handcrafted maps with varied obstacles and enemy patrols
- Distinct win conditions for single duckling, sibling, and adult missions
- Context-driven HUD that tracks lives, direction, and mission flow

## Scripts

- `bun dev` – start the Next.js development server with Turbopack
- `bun run lint` – lint all TypeScript and TSX files with ESLint
- `bun run build` – create an optimized production build
- `bun start` – serve the production build

## Tech Stack

- Next.js 15.5 with the App Router and typed routes
- React 19 with React Three Fiber and Drei helpers
- Tailwind CSS 4 for utility styling plus custom ShadCN-inspired components
- Zustand for efficient real-time game state management
