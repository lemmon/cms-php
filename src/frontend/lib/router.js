const regs = {}

function router(routes) {
  const path = location.pathname.substr(window.root.length) || '/'
  for (const [ route, cb ] of routes) {
    const match = typeof route === 'string' ? route === path : route.exec(path)
    if (match) {
      return cb(match)
    }
  }
}

module.exports = router
