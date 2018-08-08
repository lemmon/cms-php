const html = require('nanohtml')
const Component = require('nanocomponent')
const Container = require('../../lib/components-container')

const loader = require('../partials/loader')
const Input = require('./input')
const button = require('../partials/button')

module.exports = class Form extends Component {

  constructor(props) {
    super()
    const { id } = props
    this._components = new Container()
    this._action = props.action
    this._data = !props.id && {} || null
    this._id = props.id
    this._loading = false
    if (props.id) {
      fetch(linkTo(`/${props.collection.id}/${props.id}.json`), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
      }).then(res => (
        res.json()
      )).then(res => {
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
                  loading: this._loading,
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
    const form = e.target
    const data = new FormData(form)
    this._loading = true
    this.render(props, true)
    fetch(linkTo(`/${props.collection.id}${props.id && `/${props.id}` || ``}`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(Object.assign({}, this._data, {
        id: undefined,
        //action: undefined,
        created: undefined,
        updated: undefined,
      })),
      credentials: 'include',
    }).then(res => (
      res.json()
    )).then(res => {
      if (res.error) {
        throw Error(res.message || `Unknown error`)
      }
      redir(`/${props.collection.id}`)
    }).catch(err => {
      console.error(err)
      this._loading = false
      this.render(props)
    })
  }
}
