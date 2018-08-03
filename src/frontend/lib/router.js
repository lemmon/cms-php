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

router.to = function(href) {
  return window.root + href
}

module.exports = router
