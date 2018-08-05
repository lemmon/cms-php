const morph = require('nanomorph')
const state = require('./state')

// render emitter
function render() {
  morph(document.body, state.page())
}

// components
const ComponentContainer = require('./lib/components-container.js')
const container = new ComponentContainer()

render.component = (Component, props, instanceId) => (
  container.render(Component, props, instanceId)
)

//
module.exports = render
