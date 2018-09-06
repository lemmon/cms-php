const api = require('./api')
const state = require('./state')
const render = require('./render')
const navigate = require('./navigate')

// page and app mount
state.app = document.getElementById('app')
state.page = require('./views')

// load schema and run
api.get('/schema.json').then(res => {
  state.schema = res
  render()
}).catch(e => {
  console.error(e)
})
