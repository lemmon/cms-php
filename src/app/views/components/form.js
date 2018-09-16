const html = require('nanohtml')
const Component = require('nanocomponent')
const api = require('../../api')

const Fields = {
  number: require('./field-number'),
  slug: require('./field-slug'),
  text: require('./field-text'),
}

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
    this.state = {
      defaultAction: props.action,
      currentAction: null,
      data: !props.id && {} || null,
      fields: {},
      loading: false,
    }
    if (props.id) {
      api.get(`/${props.collection.name}/${props.id}.json`).then(res => {
        this.state.data = res.data || false
        this.render(props)
      })
    }
    this.update(props)
  }

  field(_props) {
    const {
      data,
      fields,
    } = this.state
    if (!fields[_props.name]) {
      fields[_props.name] = new Fields[_props.type](Object.assign({}, _props, {
        onupdate: props => Object.assign(props, {
          value: data[props.name],
          disabled: this.state.loading,
        }),
        onchange: field => {
          data[field.name] = field.value
        },
      }))
    }
    const field = fields[_props.name]
    return field.render(field.props)
  }

  createElement() {
    const {
      collection,
      action,
      id,
    } = this.props
    const {
      data,
      loading,
      currentAction,
    } = this.state
    return data && html`
      <div>
        <form
          method="post"
          novalidate="true"
          onsubmit=${e => this.handleSubmit(e)}
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
                    style: 'transparent',
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
    this.props = props
    return !this.state.loading || force
  }

  fields() {
    return this.props.collection.fields.map(field => (
      this.state.fields[field.name]
    ))
  }

  data() {
    return this.props.collection.fields.reduce((data, field) => Object.assign(data, {
      [field.name]: this.state.fields[field.name].value || null,
    }), {})
  }

  validate() {
    return Promise.all(this.fields().map(field => (
      // validate field
      field.validate().then(() => {
        if (!field.isValid()) {
          throw Error('field is invalid')
        }
        return field
      })
    ))).then(fields => fields.reduce((data, field) => Object.assign(data, {
      // map fields to `name`: `value` object
      [field.name]: field.value,
    }), {}))
  }

  handleSubmit(e) {
    e.preventDefault()
    const { collection } = this.props
    const { currentAction, defaultAction } = this.state
    this.state.loading = true
    this.render(this.props, true)
    const action = actions[currentAction || defaultAction]
    this[action]().then(() => {
      // redir to listing
      redirTo(`/${collection.name}`)
    }).catch(err => {
      // error
      this.state.loading = false
      this.state.currentAction = null
      this.render(this.props)
    })
  }

  handleCreate() {
    return this.validate().then(data => (
      api.post(`/${this.props.collection.name}`, {
        data,
      })
    ))
  }

  handleUpdate() {
    return this.validate().then(data => (
      api.post(`/${this.props.collection.name}/${this.props.id}`, {
        data: Object.assign({}, data, {
          id: undefined,
          created: undefined,
          updated: undefined,
        }),
      })
    ))
  }

  handleDelete(data) {
    return api.delete(`/${this.props.collection.name}/${this.props.id}`)
  }
}
