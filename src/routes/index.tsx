import { createFileRoute } from '@tanstack/react-router'

const HomePage = () => (
  <main className="mx-auto max-w-2xl px-4 py-14">
    <h1 className="text-3xl font-bold tracking-tight">FactorioBlueprints</h1>
    <p className="mt-3 text-muted-foreground">
      Store and browse Factorio blueprint export strings, with parsed previews
      instead of opaque blobs.
    </p>
  </main>
)

export const Route = createFileRoute('/')({ component: HomePage })
