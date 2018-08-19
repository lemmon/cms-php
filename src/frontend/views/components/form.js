const html = require('nanohtml')
const Component = require('nanocomponent')
const api = require('../../api')

const Input = require('./textarea')

const loader = require('../partials/loader')
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
    this._collection = props.collection
    this._defaultAction = props.action
    this._currentAction = null
    this._entryId = id
    this._data = !id && {} || null
    this._fields = {}
    this._loading = false
    if (id) {
      api.get(`/${this._collection.id}/${id}.json`).then(res => {
        this._data = res
        this.render(props)
      })
    }
  }

  field(_props) {
    if (!this._fields[_props.name]) {
      const props = Object.assign({}, _props, {
        onupdate: props => Object.assign(props, {
          value: this._data[props.name],
        }),
        onblur: c => {
          this._data[props.name] = c.value || null
        },
        onkeypress: e => {
          if (e.keyCode === 13 && (e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey) {
            e.preventDefault()
            this.handleSubmit(e, props)
          }
        }
      })
      this._fields[_props.name] = {
        props,
        component: new Input(props),
      }
    }
    const field = this._fields[_props.name]
    return field.component.render(field.props)
  }

  createElement(props) {
    const { action, id, onsubmit } = props
    return this._data && html`
      <div>
        <form
          method="post"
          novalidate="true"
          onsubmit=${e => this.handleSubmit(e, props)}
        >
          <div class="p05">
            ${this._collection.fields.map(field => html`
              <div class="p1">
                ${this.field(field)}
              </div>
            `)}
            <div class="row justify-between">
              <div class="p1">
                ${button({
                  type: 'submit',
                  caption: 'Submit Form',
                  color: 'blue',
                  disabled: this._loading,
                  loading: this._loading && !this._currentAction,
                })}
              </div>
              ${id && html`
                <div class="p1">
                  ${button({
                    type: 'submit',
                    caption: 'Delete',
                    style: 'clear',
                    color: 'red',
                    disabled: this._loading,
                    loading: this._loading && this._currentAction === 'delete',
                    onclick: e => {
                      this._currentAction = 'delete'
                    },
                  })}
                </div>
              ` || ``}
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

  fields() {
    return this._collection.fields.map(field => (
      this._fields[field.name]
    ))
  }

  validate() {
    return Promise.all(this.fields().map(({ component, props }) => (
      component.validate(props)
    )))
  }

  handleSubmit(e, props) {
    e.preventDefault()
    document.activeElement.blur()

    this._loading = true
    this.render(props, true)
    const action = actions[this._currentAction || this._defaultAction]

    this[action]().then(() => {
      // redir to listing
      redirTo(`/${this._collection.id}`)
    }).catch(err => {
      // error
      this._loading = false
      this._currentAction = null
      this.render(props)
    })
  }

  handleCreate() {
    return this.validate().then(() => (
      api.post(`/${this._collection.id}`, this._data)
    ))
  }

  handleUpdate() {
    return this.validate().then(() => (
      api.post(`/${this._collection.id}/${this._entryId}`, Object.assign({}, this._data, {
        id: undefined,
        created: undefined,
        updated: undefined,
      }))
    ))
  }

  handleDelete(data) {
    return api.delete(`/${this._collection.id}/${this._entryId}`)
  }
}
