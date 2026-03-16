/**
 * Run local API server + Vite dev in one process (spawns both).
 * Usage: npm run dev:local
 */
import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const api = spawn('node', ['server/local-api.js'], {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, FORCE_COLOR: '1' },
})

// Wait for API to listen before starting Vite (avoids proxy connection refused)
await new Promise((r) => setTimeout(r, 800))

const vite = spawn('npx', ['vite'], {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, FORCE_COLOR: '1' },
})

function killAll() {
  api.kill('SIGTERM')
  vite.kill('SIGTERM')
  process.exit(0)
}
process.on('SIGINT', killAll)
process.on('SIGTERM', killAll)

api.on('error', (err) => {
  console.error('Local API failed:', err)
  killAll()
})
vite.on('error', (err) => {
  console.error('Vite failed:', err)
  killAll()
})
api.on('exit', (code) => {
  if (code !== 0 && code !== null) killAll()
})
vite.on('exit', (code) => {
  if (code !== 0 && code !== null) killAll()
})

console.log('Starting: Local API (3001) + Vite dev. Open http://localhost:5173 and try Homework Adventure.')
console.log('Stop with Ctrl+C.')
