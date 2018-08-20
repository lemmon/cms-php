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
    this.state = {
      collection: props.collection,
      defaultAction: props.action,
      currentAction: null,
      id: id,
      data: !id && {} || null,
      fields: {},
      loading: false,
    }
    if (id) {
      api.get(`/${this.state.collection.name}/${id}.json`).then(res => {
        this.state.data = res.data || false
        this.render(props)
      })
    }
  }

  field(_props) {
    const {
      fields,
      data,
    } = this.state
    if (!fields[_props.name]) {
      const props = Object.assign({}, _props, {
        onupdate: props => Object.assign(props, {
          value: data[props.name],
        }),
        onblur: c => {
          data[props.name] = c.value || null
        },
        onkeypress: e => {
          if (e.keyCode === 13 && (e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey) {
            e.preventDefault()
            this.handleSubmit(e, props)
          }
        }
      })
      fields[_props.name] = {
        props,
        component: new Input(props),
      }
    }
    const field = fields[_props.name]
    return field.component.render(field.props)
  }

  createElement(props) {
    const { action, id, onsubmit } = props
    const {
      collection,
      data,
      loading,
      currentAction,
    } = this.state
    return data && html`
      <div>
        <form
          method="post"
          novalidate="true"
          onsubmit=${e => this.handleSubmit(e, props)}
        >
          <div class="p05">
            ${collection.fields.map(field => html`
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
                  disabled: loading,
                  loading: loading && !currentAction,
                })}
              </div>
              ${id && html`
                <div class="p1">
                  ${button({
                    type: 'submit',
                    caption: 'Delete',
                    style: 'clear',
                    color: 'red',
                    disabled: loading,
                    loading: loading && currentAction === 'delete',
                    onclick: e => {
                      this.state.currentAction = 'delete'
                    },
                  })}
                </div>
              ` || ``}
            </div>
          </div>
        </form>
      </div>
    ` || data === false && html`
      <div class="p05">
        <div class="p1">
          <div>Entry not found.</div>
        </div>
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
    return !this.state.loading || force
  }

  fields() {
    return this.state.collection.fields.map(field => (
      this.state.fields[field.name]
    ))
  }

  data() {
    return this.state.data
  }

  validate() {
    return Promise.all(this.fields().map(({ component, props }) => (
      component.validate(props)
    )))
  }

  handleSubmit(e, props) {
    e.preventDefault()
    const {
      collection,
      currentAction,
      defaultAction,
    } = this.state

    if (document.activeElement.closest('.field')) {
      document.activeElement.blur()
    }

    this.state.loading = true
    this.render(props, true)
    const action = actions[currentAction || defaultAction]
    this[action]().then(() => {
      // redir to listing
      redirTo(`/${collection.name}`)
    }).catch(err => {
      // error
      this.state.loading = false
      this.state.currentAction = null
      this.render(props)
    })
  }

  handleCreate() {
    return this.validate().then(() => (
      api.post(`/${this.state.collection.name}`, {
        data: this.data(),
      })
    ))
  }

  handleUpdate() {
    return this.validate().then(() => (
      api.post(`/${this.state.collection.name}/${this.state.id}`, {
        data: Object.assign({}, this.data(), {
          id: undefined,
          created: undefined,
          updated: undefined,
        }),
      })
    ))
  }

  handleDelete(data) {
    return api.delete(`/${this.state.collection.name}/${this.state.id}`)
  }
}
