const html = require('nanohtml')
const Component = require('nanocomponent')
const Container = require('../../lib/components-container')

const loader = require('../partials/loader')
const Input = require('./input')

module.exports = class Form extends Component {

  constructor(props) {
    super()
    const { id } = props
    this.components = new Container()
    this.action = props.action
    this.data = !props.id && {} || null
    this.id = props.id
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
        this.data = res
        this.render(props)
      })
    }
  }

  component(Component, props, instanceId) {
    return this.components.render(Component, props, instanceId)
  }

  createElement(props) {
    const { collection, action, id, onsubmit } = props
    return this.data && html`
      <div class="max40">
        <form
          method="post"
          novalidate="true"
          onsubmit=${e => this.handleSubmit(e, props)}
        >
          <div class="p05">
            ${collection.fields.map(field => html`
              <div class="p1">
                ${this.component(Input, Object.assign({}, field, {
                  value: this.data[field.name],
                  onchange: value => {
                    this.data[field.name] = value || null
                  },
                }), field.name)}
              </div>
            `)}
            <div class="p1">
              <button
                class="bg-blue color-white p1 lh4"
                style="
                  display: block;
                  border: 0;
                  font-family: inherit;
                  font-size: inherit;
                "
              >Submit Form</button>
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

  update() {
    return true
  }

  handleSubmit(e, props) {
    e.preventDefault()
    //const form = e.target
    fetch(linkTo(`/${props.collection.id}${props.id && `/${props.id}` || ``}`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(Object.assign({}, this.data, {
        id: undefined,
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
    })
  }
}
