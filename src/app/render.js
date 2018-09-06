const morph = require('nanomorph')
const state = require('./state')

const Component = require('nanocomponent')
const Container = require('./lib/components-container')

// render emitter
function render() {
  morph(
    state.app,
    state.page(),
  )
}

// components
const components = new Container()

render.component = (Component, props, instanceId) => (
  components.render(Component, props, instanceId)
)

//
module.exports = render
