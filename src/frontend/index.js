const router = require('./lib/router')
const api = require('./api')
const state = require('./state')
const render = require('./render')
const navigate = require('./navigate')
const page = require('./views')

// load schema and run
api.get('/schema.json').then(res => {
  state.page = page
  state.schema = res
  render()
}).catch(e => {
  console.error(e)
})
