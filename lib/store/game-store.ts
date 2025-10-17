import { create } from "zustand"
import { directionToFacing } from "../game/math"
import { buildInitialState, stepGame } from "../game/logic"
import type { GameState, GameStore, InputDirection } from "../game/types"

const useGameStore = create<GameStore>((set) => ({
  ...buildInitialState(0, 3),
  tick: (delta: number) => {
    set((state) => {
      const next = stepGame(state as GameState, delta)
      return { ...state, ...next }
    })
  },
  setInput: (direction: InputDirection) => {
    set((state) => {
      const facing = direction.x === 0 && direction.z === 0 ? state.player.facing : directionToFacing(direction)
      return {
        ...state,
        input: direction,
        player: { ...state.player, facing },
      }
    })
  },
  startLevel: (index: number) => {
    set((state) => ({
      ...state,
      ...buildInitialState(index, state.lives),
    }))
  },
  advanceLevel: () => {
    set((state) => {
      const nextIndex = Math.min(state.currentLevelIndex + 1, state.levels.length - 1)
      return {
        ...state,
        ...buildInitialState(nextIndex, state.lives),
      }
    })
  },
  restartLevel: () => {
    set((state) => ({
      ...state,
      ...buildInitialState(state.currentLevelIndex, state.lives),
    }))
  },
  resetGame: () => {
    set((state) => ({
      ...state,
      ...buildInitialState(0, 3),
    }))
  },
}))

export { useGameStore }
