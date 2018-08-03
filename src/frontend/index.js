const morph = require('nanomorph')
const router = require('./lib/router')
const page = require('./views')

// state
const HISTORY_OBJECT = {}
const state = {}

// navigation
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

// render emitter
function render() {
  morph(document.body, page(state, render))
}

// load schema
fetch(router.to('/schema.json'), {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
}).then(res => (
  res.json()
)).then(res => {
  state.schema = res.schema
  render()
})
