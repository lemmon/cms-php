const router = require('./lib/router')
const state = require('./state')
const render = require('./render')
const page = require('./views')

// navigation
const HISTORY_OBJECT = {}

window.addEventListener('click', (e) => {
  if (e.defaultPrevented) {
    return
  }
  const target = e.target.closest('a[href]')
  if (target) {
    e.preventDefault();
    history.pushState(HISTORY_OBJECT, null, window.root + target.attributes.href.value)
    render()
  }
})

window.onpopstate = () => {
  render()
}

window.linkTo = (href) => {
  return window.root + href
}

window.redir = (href) => {
  history.pushState(HISTORY_OBJECT, null, window.root + href)
  render()
}

// load schema and run
fetch(linkTo('/schema.json'), {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
}).then(res => (
  res.json()
)).then(res => {
  state.page = page
  state.schema = res.schema
  render()
}).catch(e => {
  console.error(e)
})
