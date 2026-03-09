import { createRequire } from 'node:module'
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import { madeRefine } from 'made-refine/vite'

const require = createRequire(import.meta.url)

const config = defineConfig({
  plugins: [
    // devtools disabled to avoid port conflict with other worktree
    // devtools({ port: 42070 }),
    nitro(),
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact({
      babel: {
        plugins: [require.resolve('made-refine/babel')],
      },
    }),
    madeRefine(),
  ],
})

export default config
