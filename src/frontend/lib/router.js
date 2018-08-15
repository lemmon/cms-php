const rootPath = window.rootPath

module.exports = function router(routes) {
  const path = rootPath ? location.pathname.split(rootPath, 2)[1] || '/' : location.pathname
  for (const [ route, cb ] of routes) {
    const match = typeof route === 'string' ? route === path : route.exec(path)
    if (match) {
      return cb(match)
    }
  }
}
