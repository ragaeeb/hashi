import { GameCanvas } from "@/components/game/canvas/game-canvas"
import { Hud } from "@/components/game/hud/hud"

type PageProps = {
  params: Promise<Record<string, string>>
  searchParams: Promise<Record<string, string | string[]>>
}

const HomePage = async ({ params, searchParams }: PageProps) => {
  await params
  await searchParams
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-sky-100 via-amber-100 to-rose-100 p-6">
      <div className="relative h-[80vh] w-full max-w-5xl">
        <GameCanvas />
        <Hud />
      </div>
    </main>
  )
}

export default HomePage
