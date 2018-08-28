const render = require('./render')
const rootPath = window.rootPath

const HISTORY_OBJECT = {}

window.addEventListener('click', (e) => {
  if ((e.button && e.button !== 0)
    || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey
    || e.defaultPrevented
  ) {
      return
  }

  const anchor = e.target.closest('a[href]')
  if (!anchor) {
    return
  }

  const locationHref = location.href.split(rootPath, 2)
  const anchorHref = anchor.href.split(rootPath, 2)

  if (locationHref[0] === anchorHref[0]) {
    e.preventDefault()
    document.activeElement.blur()
    history.pushState(HISTORY_OBJECT, null, anchor.href)
    render()
  }
})

window.onpopstate = () => {
  render()
}

window.linkTo = (href) => {
  return rootPath + href
}

window.redirTo = (href) => {
  history.pushState(HISTORY_OBJECT, null, rootPath + href)
  render()
}
