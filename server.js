const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const PORT = process.env.PORT || 3000

app.prepare().then(() => {
  createServer((req, res) => {
    const { pathname } = parse(req.url, true)

    if (pathname.match(/\/[0-9A-Za-z]+$/)) {
      return app.render(req, res, '/person', {})
    }

    handle(req, res)
    return
  })
  .listen(PORT, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${PORT}`)
  })
})
