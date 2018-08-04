module.exports = class ComponentsContainer {
  constructor() {
    this.components = {}
  }

  render(Component, props, instanceId) {
    const component = this.createComponent(Component, props, instanceId)
    return component.render(props)
  }

  createComponent(Component, props, instanceId) {
    const id = Component.prototype.constructor.name + '__' + instanceId

    if (this.components[id]) {
      return this.components[id]
    }

    const component = new Component(props)

    const _load = component.load
    const _unload = component.unload

    component.load = (el) => {
      if (_load) {
        _load.call(component, el)
      }
    }

    component.unload = (el) => {
      if (_unload && _unload.call(component, el) === false) {
        return
      }
      delete this.components[id]
    }

    return this.components[id] = component
  }
}
