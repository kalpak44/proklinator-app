import express from 'express'

const app = express()

const port = Number(process.env.PORT) || 3000
const sha = process.env.GIT_SHA || 'unknown'

app.disable('x-powered-by')

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, sha })
})

app.use((_req, res) => {
  res.status(404).json({ error: 'not found' })
})

const server = app.listen(port, () => {
  console.log(`proklinator-api listening on ${port} (sha ${sha})`)
})

for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, () => {
    server.close(() => process.exit(0))
  })
}
