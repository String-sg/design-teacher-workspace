import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

// Start react-grab relay server in dev mode
const isDev = process.argv.includes('dev') || process.env.NODE_ENV === 'development'
if (isDev) {
  Promise.all([
    import('@react-grab/relay/server'),
    import('@react-grab/claude-code/handler'),
  ]).then(([{ createRelayServer }, { claudeAgentHandler }]) => {
    const server = createRelayServer()
    server.registerHandler(claudeAgentHandler)
    server.start()
    console.log('React Grab relay server started on port 4567')
  })
}

const config = defineConfig({
  plugins: [
    // devtools disabled to avoid port conflict with other worktree
    // devtools({ port: 42070 }),
    nitro(),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
