const html = require('nanohtml')
const Component = require('nanocomponent')
const Container = require('../../lib/components-container')
const api = require('../../api')

const loader = require('../partials/loader')
const Input = require('./input')
const button = require('../partials/button')

const actions = {
  create: 'handleCreate',
  update: 'handleUpdate',
  delete: 'handleDelete',
}

module.exports = class Form extends Component {

  constructor(props) {
    super()
    const { id } = props
    this._components = new Container()
    this._action = props.action
    this._currentAction = null
    this._data = !props.id && {} || null
    this._id = props.id
    this._loading = false
    if (props.id) {
      api.get(`/${props.collection.id}/${props.id}.json`).then(res => {
        this._data = res
        this.render(props)
      })
    }
  }

  component(Component, props, instanceId) {
    return this._components.render(Component, props, instanceId)
  }

  createElement(props) {
    const { collection, action, id, onsubmit } = props
    return this._data && html`
      <div>
        <form
          method="post"
          novalidate="true"
          onsubmit=${e => this.handleSubmit(e, props)}
        >
          <div class="p05">
            ${collection.fields.map(field => html`
              <div class="p1">
                ${this.component(Input, Object.assign({}, field, {
                  value: this._data[field.name],
                  onchange: value => {
                    this._data[field.name] = value || null
                  },
                }), field.name)}
              </div>
            `)}
            <div class="row justify-between">
              <div class="p1">
                ${button({
                  type: 'submit',
                  caption: 'Submit Form',
                  bgColor: 'blue',
                  disabled: this._loading,
                  loading: this._loading && !this._currentAction,
                })}
              </div>
              <div class="p1">
                ${button({
                  type: 'submit',
                  caption: '\u2327',
                  bgColor: 'red',
                  disabled: this._loading,
                  loading: this._loading && this._currentAction === 'delete',
                  onclick: e => {
                    this._currentAction = 'delete'
                  },
                })}
              </div>
            </div>
          </div>
        </form>
      </div>
    ` || html`
      <div class="p05">
        <div class="p1">
          ${loader()}
        </div>
      </div>
    `
  }

  update(props, force) {
    return !this._loading || force
  }

  handleSubmit(e, props) {
    e.preventDefault()
    document.activeElement.blur()
    this._loading = true
    this.render(props, true)
    const action = this._currentAction || this._action
    this[actions[action]](props).then(res => {
      redir(`/${props.collection.id}`)
    }).catch(err => {
      console.error(err)
      this._loading = false
      this._currentAction = null
      this.render(props)
    })
  }

  handleCreate(props) {
    return api.post(`/${props.collection.id}`, this._data)
  }

  handleUpdate(props) {
    return api.post(`/${props.collection.id}/${props.id}`, Object.assign({}, this._data, {
      id: undefined,
      created: undefined,
      updated: undefined,
    }))
  }

  handleDelete(props) {
    return api.delete(`/${props.collection.id}/${props.id}`, this._data)
  }
}
