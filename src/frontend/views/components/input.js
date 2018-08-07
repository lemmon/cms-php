const html = require('nanohtml')
const Component = require('nanocomponent')

module.exports = class Input extends Component {

  constructor(props) {
    super()
    this.value = props.value || ``
  }

  createElement(props) {
    return html`
      <label class="block" style="position: relative;">
        <div
          class="f2 fw500 color-black-40 bg-white"
          style="
            line-height: 1rem;
            position: absolute;
            left: .5rem;
            top: -.5rem;
            padding: 0 .5rem;
          "
        >${props.name}</div>
        <input
          type="text"
          name=${props.name}
          value=${props.value !== undefined ? props.value || `` : this.value}
          class="p1 lh4 ba b-black-10 bg-white"
          style="
            display: block;
            width: 100%;
            font-family: inherit;
            font-size: inherit;
          "
          oninput=${e => this.handleInput(e, props)}
          change=${e => this.handleChange(e, props)}
          onfocus=${e => this.handleFocus(e, props)}
          onblur=${e => this.handleBlur(e, props)}
        />
      </label>
    `
  }

  update(props) {
    if (props.value !== undefined) {
      this.value = props.value
    }
    return true
  }

  handleInput(e, props) {
    this.value = e.target.value
  }

  handleChange(e, props) {
  }

  handleFocus(e, props) {
  }

  handleBlur(e, props) {
    this.value = e.target.value.trim()
    if (props.onchange) {
      props.onchange(this.value)
    }
    this.render(Object.assign(props, {
      value: props.value !== undefined ? this.value : undefined
    }))
  }
}
