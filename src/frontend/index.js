const router = require('./lib/router')
const state = require('./state')
const render = require('./render')
const page = require('./views')

// navigation
const HISTORY_OBJECT = {}

window.addEventListener('click', (e) => {
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

// load schema and run
fetch(router.to('/schema.json'), {
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
